'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Claims';
const expectedTitle = `${expectedH1}`;
const targetClaim = { id: 15, name: 'Sinistro dsfsdf' };
const targetClaimDashboardIndex = 3;
const nameSuffix = 'X';
const newClaimName = targetClaim.name + nameSuffix;

class Claim {
  id: number;
  name: string;

  // Factory methods

  // Claim from string formatted as '<id> <name>'.
  static fromString(s: string): Claim {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Claim from Claim list <li> element.
  static async fromLi(li: ElementFinder): Promise<Claim> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Claim id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Claim> {
    // Get Claim id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topClaims: element.all(by.css('app-root app-dashboard > div h4')),

      appClaimsHref: navElts.get(1),
      appClaims: element(by.css('app-root app-claims')),
      allClaims: element.all(by.css('app-root app-claims li')),
      selectedClaimSubview: element(by.css('app-root app-claims > div:last-child')),

      claimDetail: element(by.css('app-root app-Claim-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Claims'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top claims', () => {
      let page = getPageElts();
      expect(page.topClaims.count()).toEqual(4);
    });

    it(`selects and routes to ${targetClaim.name} details`, dashboardSelectTargetClaim);

    it(`updates Claim name (${newClaimName}) in details view`, updateClaimNameInDetailView);

    it(`cancels and shows ${targetClaim.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetClaimElt = getPageElts().topClaims.get(targetClaimDashboardIndex);
      expect(targetClaimElt.getText()).toEqual(targetClaim.name);
    });

    it(`selects and routes to ${targetClaim.name} details`, dashboardSelectTargetClaim);

    it(`updates Claim name (${newClaimName}) in details view`, updateClaimNameInDetailView);

    it(`saves and shows ${newClaimName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetClaimElt = getPageElts().topClaims.get(targetClaimDashboardIndex);
      expect(targetClaimElt.getText()).toEqual(newClaimName);
    });

  });

  describe('Claims tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Claims view', () => {
      getPageElts().appClaimsHref.click();
      let page = getPageElts();
      expect(page.appClaims.isPresent()).toBeTruthy();
      expect(page.allClaims.count()).toEqual(10, 'number of claims');
    });

    it('can route to Claim details', async () => {
      getClaimLiEltById(targetClaim.id).click();

      let page = getPageElts();
      expect(page.claimDetail.isPresent()).toBeTruthy('shows Claim detail');
      let claim = await Claim.fromDetail(page.claimDetail);
      expect(claim.id).toEqual(targetClaim.id);
      expect(claim.name).toEqual(targetClaim.name.toUpperCase());
    });

    it(`updates Claim name (${newClaimName}) in details view`, updateClaimNameInDetailView);

    it(`shows ${newClaimName} in Claims list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetClaim.id} ${newClaimName}`;
      expect(getClaimAEltById(targetClaim.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newClaimName} from Claims list`, async () => {
      const claimsBefore = await toClaimArray(getPageElts().allClaims);
      const li = getClaimLiEltById(targetClaim.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appClaims.isPresent()).toBeTruthy();
      expect(page.allClaims.count()).toEqual(9, 'number of claims');
      const claimsAfter = await toClaimArray(page.allClaims);
      // console.log(await Claim.fromLi(page.allClaims[0]));
      const expectedClaims =  claimsBefore.filter(h => h.name !== newClaimName);
      expect(claimsAfter).toEqual(expectedClaims);
      // expect(page.selectedClaimSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetClaim.name}`, async () => {
      const newClaimName = 'sdsafsafd';
      const claimsBefore = await toClaimArray(getPageElts().allClaims);
      const numClaims = claimsBefore.length;

      element(by.css('input')).sendKeys(newClaimName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let claimsAfter = await toClaimArray(page.allClaims);
      expect(claimsAfter.length).toEqual(numClaims + 1, 'number of claims');

      expect(claimsAfter.slice(0, numClaims)).toEqual(claimsBefore, 'Old claims are still there');

      const maxId = claimsBefore[claimsBefore.length - 1].id;
      expect(claimsAfter[numClaims]).toEqual({id: maxId + 1, name: newClaimName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in claims.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive Claim search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetClaim.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let Claim = page.searchResults.get(0);
      expect(Claim.getText()).toEqual(targetClaim.name);
    });

    it(`navigates to ${targetClaim.name} details view`, async () => {
      let Claim = getPageElts().searchResults.get(0);
      expect(Claim.getText()).toEqual(targetClaim.name);
      Claim.click();

      let page = getPageElts();
      expect(page.claimDetail.isPresent()).toBeTruthy('shows Claim detail');
      let claim2 = await Claim.fromDetail(page.claimDetail);
      expect(claim2.id).toEqual(targetClaim.id);
      expect(claim2.name).toEqual(targetClaim.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetClaim() {
    let targetClaimElt = getPageElts().topClaims.get(targetClaimDashboardIndex);
    expect(targetClaimElt.getText()).toEqual(targetClaim.name);
    targetClaimElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    let page = getPageElts();
    expect(page.claimDetail.isPresent()).toBeTruthy('shows Claim detail');
    let claim = await Claim.fromDetail(page.claimDetail);
    expect(claim.id).toEqual(targetClaim.id);
    expect(claim.name).toEqual(targetClaim.name.toUpperCase());
  }

  async function updateClaimNameInDetailView() {
    // Assumes that the current view is the Claim details view.
    addToClaimName(nameSuffix);

    let page = getPageElts();
    let claim = await Claim.fromDetail(page.claimDetail);
    expect(claim.id).toEqual(targetClaim.id);
    expect(claim.name).toEqual(newClaimName.toUpperCase());
  }

});

function addToClaimName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getClaimAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getClaimLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toClaimArray(allClaims: ElementArrayFinder): Promise<Claim[]> {
  let promisedClaims = await allClaims.map(Claim.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedClaims);
}
