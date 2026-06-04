import TurndownService from 'turndown';
import * as cheerio from 'cheerio';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Remove clutter from standard college website layouts
turndownService.addRule('remove-clutter', {
  filter: ['script', 'noscript', 'style', 'nav', 'footer', 'header', 'aside', 'iframe', 'canvas'],
  replacement: () => ''
});

// Better table handling
turndownService.addRule('tables', {
  filter: 'table',
  replacement: function (content, node) {
    // Basic table conversion to Markdown
    let md = '\n\n';
    const rows = node.querySelectorAll('tr');
    
    rows.forEach((row, i) => {
      let rowStr = '|';
      const cells = row.querySelectorAll('th, td');
      cells.forEach(cell => {
        rowStr += ` ${cell.textContent.trim().replace(/\|/g, '\\|')} |`;
      });
      md += rowStr + '\n';
      
      // Add separator after header
      if (i === 0) {
        let sepStr = '|';
        cells.forEach(() => {
          sepStr += ' --- |';
        });
        md += sepStr + '\n';
      }
    });
    
    return md + '\n\n';
  }
});

/**
 * Extracts structured content from raw HTML
 */
export function parseHtmlToMarkdown(html: string): { markdown: string, title: string, metadata: any } {
  const $ = cheerio.load(html);
  
  // Extract Title
  const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled Page';
  
  // Try to find the main content area (heuristics for JCMCSIIT or generic sites)
  let mainContentHtml = $('main').html() || 
                        $('article').html() || 
                        $('.content').html() || 
                        $('#content').html() || 
                        $('body').html() || '';

  // Extract meta tags for description/keywords
  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';

  // Clean HTML before passing to turndown
  const $main = cheerio.load(mainContentHtml);
  $main('script, style, nav, footer, header, aside, .sidebar, .menu').remove();
  
  const markdown = turndownService.turndown($main.html() || '');

  return {
    title,
    markdown,
    metadata: {
      description,
      keywords
    }
  };
}
