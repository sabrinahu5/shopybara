from amazoncaptcha import AmazonCaptcha
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time

def main(contexts):
    items = []
    ScrollNumber = 4
    sleepTimer = 1

    options = webdriver.ChromeOptions() 
    options.add_experimental_option("excludeSwitches", ["enable-logging"])

    driver = webdriver.Chrome(options=options)
    driver.get('https://www.amazon.com/')

    for c in contexts:
        soup = BeautifulSoup(driver.page_source,'html.parser')
        search_bar = driver.find_element(By.ID, 'twotabsearchtextbox')
        search_bar.clear()
        search_bar.send_keys(c)
        search_bar.send_keys(Keys.RETURN)

        time.sleep(sleepTimer)

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        first_item = soup.find('div', {'data-component-type': 's-search-result'})
        if first_item:
            link = first_item.find('a', {'class': 'a-link-normal'})
            if link and 'href' in link.attrs:
                item_url = 'https://www.amazon.com' + link['href']
                items.append(item_url)
                print(f"Found URL for {c}: {item_url}")
            else:
                print(f"No link found for {c}")
        else:
            print(f"No results found for {c}")

    driver.quit()
    return items

if __name__ == "__main__":
    main(["white desk", "black chair"])
        


