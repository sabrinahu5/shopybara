from selenium import webdriver
from bs4 import BeautifulSoup
import time

img_urls = []
url = "https://in.pinterest.com/janiseskim/demo/"
ScrollNumber = 4
sleepTimer = 1

options = webdriver.ChromeOptions() 
options.add_experimental_option("excludeSwitches", ["enable-logging"])

driver = webdriver.Chrome(options=options)  # path=r'to/chromedriver.exe'
driver.get(url)

for _ in range(1,ScrollNumber):
    driver.execute_script("window.scrollTo(1,50)")
    time.sleep(sleepTimer)

soup = BeautifulSoup(driver.page_source,'html.parser')

for link in soup.find_all('img'):
    img_urls.append(link.get('src'))

print(img_urls)