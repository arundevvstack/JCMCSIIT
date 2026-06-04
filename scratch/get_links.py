import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

url = "https://www.jcmcsiit.ac.in/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

try:
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    links = set()
    for a in soup.find_all('a', href=True):
        href = a['href']
        # join relative links
        full_url = urljoin(url, href)
        # only keep internal links
        if urlparse(full_url).netloc == urlparse(url).netloc:
            # ignore fragments and mailto
            if not full_url.endswith('#') and not href.startswith('javascript:'):
                links.add(full_url.split('#')[0])
                
    for link in sorted(list(links)):
        print(link)
except Exception as e:
    print(f"Error: {e}")
