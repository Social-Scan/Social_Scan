import re
import requests
from bs4 import BeautifulSoup
from IPython.display import clear_output


class PPlugin:
    def __init__(self):
        pass

    def identification(self, text):
        clear_output(wait=True)

        # Find potential product keywords
        product_keywords = re.findall(r'\b[A-Za-z0-9]+\s*[A-Za-z0-9]+\b', text)
        product_keywords = [keyword for keyword in product_keywords if len(keyword) > 2]
        print(f"Identified potential products: {product_keywords}")

        search_results = {}
        for keyword in product_keywords:
            search_query = f"https://www.google.com/search?q={keyword.replace(' ', '+')}"
            response = requests.get(search_query)
            soup = BeautifulSoup(response.content, "html.parser")
            search_results[keyword] = []

            # Extract URLs from search results
            for link in soup.find_all('a', href=True):
                if "url?q=" in link['href']:
                    url = link['href'].split("url?q=")[1].split("&sa=U")[0]
                    search_results[keyword].append(url)

        # Print search results
        for keyword, urls in search_results.items():
            print(f"\nSearch results for '{keyword}':")
            if urls:
                for url in urls[:10]:  # Show only the first 10 results
                    print(url)
            else:
                print("No results found.")
