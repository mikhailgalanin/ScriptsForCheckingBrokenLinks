const axios = require('axios');
const cheerio = require('cheerio');

async function checkLinks(url) {
    try {
        // Fetch the HTML of the page
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Collect all links from the page
        const links = [];
        $('a').each((_, element) => {
            const link = $(element).attr('href');
            if (link && link.startsWith('http')) { // Only add absolute URLs
                links.push(link);
            }
        });

        console.log(`Found ${links.length} links. Checking for broken links...`);

        // Check each link's status
        for (const link of links) {
            try {
                const response = await axios.get(link);
                if (response.status === 200) {
                    console.log(`✅ ${link} is working`);
                }
            } catch (error) {
                console.error(`❌ ${link} is broken - Status: ${error.response ? error.response.status : 'No response'}`);
            }
        }

    } catch (error) {
        console.error(`Error fetching the URL: ${error.message}`);
    }
}

// Replace 'https://example.com' with the URL you want to check
checkLinks('https://tvknews.ru/');
