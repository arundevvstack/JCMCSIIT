const https = require('https');

const url = 'https://www.jcmcsiit.ac.in/';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const links = new Set();
        // Super simple regex to find hrefs
        const regex = /href=["']([^"']+)["']/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
            let href = match[1];
            if (href.startsWith('http') && !href.includes('jcmcsiit.ac.in')) continue;
            if (href.startsWith('#') || href.startsWith('javascript:')) continue;
            if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
            
            // normalize relative
            if (!href.startsWith('http')) {
                if (href.startsWith('/')) href = href.substring(1);
                href = url + href;
            }
            links.add(href.split('#')[0]);
        }
        
        const sorted = Array.from(links).sort();
        sorted.forEach(l => console.log(l));
    });
}).on('error', err => console.log('Error:', err.message));
