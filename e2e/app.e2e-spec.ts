import { AudiodeadlinePage } from './app.po';

describe('audiodeadline App', function() {
  let page: AudiodeadlinePage;

  beforeEach(() => {
    page = new AudiodeadlinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
