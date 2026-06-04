import { parseHtmlToMarkdown } from '../parsers/markdown';

export interface CrawlResult {
  url: string;
  title: string;
  markdown: string;
  metadata: any;
  timestamp: string;
  type: 'html' | 'pdf';
  buffer?: ArrayBuffer;
}

export interface CrawlOptions {
  maxPages?: number;
  onProgress?: (result: CrawlResult, remaining: number) => void;
}

export class DeepCrawler {
  private visited = new Set<string>();
  private queue: string[] = [];
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.queue.push(baseUrl);
  }

  private async fetchPage(url: string): Promise<{ type: 'html' | 'pdf', content: string | ArrayBuffer } | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/pdf')) {
        return { type: 'pdf', content: await response.arrayBuffer() };
      }
      
      return { type: 'html', content: await response.text() };
    } catch (error: any) {
      console.error(`Failed to fetch ${url}: ${error.message}`);
      return null;
    }
  }

  private extractLinks(html: string, currentUrl: string) {
    // Simple regex to grab hrefs, or use cheerio if already parsed
    // Since we are running in an environment where cheerio is available (via parseHtmlToMarkdown)
    // we can use a simpler approach or just let the caller parse it.
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      let href = match[1];
      try {
        const resolvedUrl = new URL(href, currentUrl);
        // Only crawl internal links
        if (resolvedUrl.hostname === new URL(this.baseUrl).hostname) {
          const cleanUrl = resolvedUrl.origin + resolvedUrl.pathname;
          if (!this.visited.has(cleanUrl) && !this.queue.includes(cleanUrl)) {
            this.queue.push(cleanUrl);
          }
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    }
  }

  public async start(options: CrawlOptions = {}): Promise<CrawlResult[]> {
    const results: CrawlResult[] = [];
    let limit = options.maxPages || 50;
    
    while (this.queue.length > 0 && limit > 0) {
      const currentUrl = this.queue.shift();
      if (!currentUrl || this.visited.has(currentUrl)) continue;
      
      this.visited.add(currentUrl);
      limit--;

      const pageData = await this.fetchPage(currentUrl);
      if (!pageData) continue;

      let result: CrawlResult;

      if (pageData.type === 'pdf') {
        result = {
          url: currentUrl,
          title: currentUrl.split('/').pop() || 'Document',
          markdown: '',
          metadata: {},
          timestamp: new Date().toISOString(),
          type: 'pdf',
          buffer: pageData.content as ArrayBuffer
        };
      } else {
        const html = pageData.content as string;
        const parsed = parseHtmlToMarkdown(html);
        
        result = {
          url: currentUrl,
          title: parsed.title,
          markdown: parsed.markdown,
          metadata: parsed.metadata,
          timestamp: new Date().toISOString(),
          type: 'html'
        };

        this.extractLinks(html, currentUrl);
      }

      results.push(result);
      if (options.onProgress) {
        options.onProgress(result, this.queue.length);
      }

      // Polite delay
      await new Promise(res => setTimeout(res, 500));
    }

    return results;
  }
}
