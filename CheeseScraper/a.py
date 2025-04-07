import os
import requests
from duckduckgo_search import DDGS

def download_images(query, max_images=1000, save_dir="downloads"):
    os.makedirs(save_dir, exist_ok=True)
    downloaded = 0

    print(f"Searching DuckDuckGo for images of: '{query}'")

    with DDGS() as ddgs:
        results = ddgs.images(query, max_results=max_images)

        for idx, result in enumerate(results, start=1):
            url = result.get("image")
            if not url:
                continue

            try:
                print(f"Downloading {idx}: {url}")
                response = requests.get(url, timeout=10)
                ext = url.split('.')[-1].split('?')[0][:4]  # crude extension check
                filename = f"{query.replace(' ', '_')}_{idx}.{ext}"
                filepath = os.path.join(save_dir, filename)

                with open(filepath, "wb") as f:
                    f.write(response.content)
                downloaded += 1
            except Exception as e:
                print(f"Failed to download image {idx}: {e}")
            if downloaded >= max_images:
                break

    print(f"\n✅ Done. Downloaded {downloaded} images to '{save_dir}'")

# Example usage:
if __name__ == "__main__":
    user_query = input("Enter your image search query: ")
    download_images(user_query)
