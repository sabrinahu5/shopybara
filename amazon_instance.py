import time
from scrapybara import Scrapybara
from playwright.sync_api import sync_playwright

client = Scrapybara(api_key="scrapy-eec9c644-0de2-4a4b-baeb-b6e6bbc4bb66")

instance = client.start_ubuntu(timeout_hours=1)

stream_url = instance.get_stream_url().stream_url
print(f"Stream URL: {stream_url}")

cdp_url = instance.browser.start().cdp_url
playwright = sync_playwright().start()
browser = playwright.chromium.connect_over_cdp(cdp_url)

page = browser.new_page()
page.goto("https://www.amazon.com/gp/product/B09MT3K1ZT/ref=ox_sc_act_title_2?smid=A18BAUGCX0X64V&psc=1")
print("Navigated to Amazon.com")

page.fill('input#twotabsearchtextbox', 'white desk')
page.click('input#nav-search-submit-button')
print("Search for 'white desk' submitted.")

page.wait_for_selector('span.a-dropdown-label')

page.click('span.a-dropdown-label')
page.click('a#s-result-sort-select_1')

time.sleep(5)
print("Sorted and loaded bestsellers.")

page.wait_for_selector('div.s-main-slot div.s-result-item')
page.click('div.s-main-slot div.s-result-item[data-component-type="s-search-result"] a')
print("Clicked on the first search result.")

product_url = page.url
print(f"Product Page URL: {product_url}")

auth_state_id = instance.browser.save_auth(name="default").auth_state_id

instance.browser.authenticate(auth_state_id=auth_state_id)

browser.close()
instance.stop()