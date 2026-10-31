import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  preview: vi.fn(),
  address: vi.fn(),
  closeServer: vi.fn(),
  launch: vi.fn(),
  newPage: vi.fn(),
  closeBrowser: vi.fn(),
  goto: vi.fn(),
  on: vi.fn(),
  click: vi.fn(),
  count: vi.fn(),
  attribute: vi.fn(),
  css: vi.fn(),
  visible: vi.fn(),
  browserExpect: vi.fn(),
}));
vi.mock('vite', () => ({ preview: mocks.preview }));
vi.mock('@playwright/test', () => ({
  chromium: { launch: mocks.launch },
  expect: mocks.browserExpect,
}));

const first = { click: mocks.click };
const second = { click: mocks.click };
const switches = { first: () => first, last: () => second };
const page = {
  goto: mocks.goto,
  on: mocks.on,
  getByRole: vi.fn(() => switches),
  getByText: vi.fn(() => ({})),
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.on.mockReset();
  mocks.address.mockReturnValue({ port: 4567 });
  mocks.closeServer.mockImplementation((done: (error?: Error) => void) => done());
  mocks.preview.mockResolvedValue({
    httpServer: { address: mocks.address, close: mocks.closeServer },
  });
  mocks.launch.mockResolvedValue({
    newPage: mocks.newPage,
    close: mocks.closeBrowser,
  });
  mocks.newPage.mockResolvedValue(page);
  mocks.goto.mockResolvedValue(undefined);
  mocks.closeBrowser.mockResolvedValue(undefined);
  mocks.click.mockResolvedValue(undefined);
  mocks.count.mockResolvedValue(undefined);
  mocks.attribute.mockResolvedValue(undefined);
  mocks.css.mockResolvedValue(undefined);
  mocks.visible.mockResolvedValue(undefined);
  mocks.browserExpect.mockReturnValue({
    toHaveCount: mocks.count,
    toHaveAttribute: mocks.attribute,
    toHaveCSS: mocks.css,
    toBeVisible: mocks.visible,
  });
});

describe('actual installed browser acceptance', () => {
  it('checks both isolated applications, real styles and reversibility', async () => {
    const { exerciseInstalledBootstrap } = await import('./browser.js');
    await exerciseInstalledBootstrap('/installed/consumer');
    expect(mocks.preview).toHaveBeenCalledWith({
      root: '/installed/consumer',
      configFile: false,
      preview: { host: '127.0.0.1', port: 0, strictPort: true },
    });
    expect(mocks.goto).toHaveBeenCalledWith('http://127.0.0.1:4567');
    expect(page.getByRole).toHaveBeenCalledWith('switch', {
      name: 'Email summaries',
    });
    expect(mocks.count).toHaveBeenCalledWith(2);
    expect(mocks.css).toHaveBeenCalledWith('display', 'flex');
    expect(mocks.click).toHaveBeenCalledTimes(3);
    expect(mocks.attribute).toHaveBeenCalledWith('aria-checked', 'true');
    expect(mocks.attribute).toHaveBeenCalledWith('aria-checked', 'false');
    expect(mocks.closeBrowser).toHaveBeenCalledOnce();
    expect(mocks.closeServer).toHaveBeenCalledOnce();
  });

  it.each([null, 'named-pipe'])('rejects a non-TCP address: %j', async (address) => {
    const { exerciseInstalledBootstrap } = await import('./browser.js');
    mocks.address.mockReturnValue(address);
    await expect(exerciseInstalledBootstrap('/consumer')).rejects.toThrow('TCP');
    expect(mocks.launch).not.toHaveBeenCalled();
    expect(mocks.closeServer).toHaveBeenCalledOnce();
  });

  it('closes the server if Chromium cannot launch', async () => {
    const { exerciseInstalledBootstrap } = await import('./browser.js');
    mocks.launch.mockRejectedValueOnce(new Error('Launch failed.'));
    await expect(exerciseInstalledBootstrap('/consumer')).rejects.toThrow('Launch');
    expect(mocks.closeBrowser).not.toHaveBeenCalled();
    expect(mocks.closeServer).toHaveBeenCalledOnce();
  });

  it.each(['newPage', 'goto', 'count', 'click', 'closeBrowser'] as const)(
    'closes browser and server after a failed %s stage',
    async (stage) => {
      const { exerciseInstalledBootstrap } = await import('./browser.js');
      mocks[stage].mockRejectedValueOnce(new Error('Browser stage failed.'));
      await expect(exerciseInstalledBootstrap('/consumer')).rejects.toThrow(
        'Browser stage',
      );
      expect(mocks.closeBrowser).toHaveBeenCalledOnce();
      expect(mocks.closeServer).toHaveBeenCalledOnce();
    },
  );

  it('rejects page errors instead of reporting an interactive pass', async () => {
    const { exerciseInstalledBootstrap } = await import('./browser.js');
    mocks.on.mockImplementation((_event: string, listener: (error: Error) => void) => {
      listener(new Error('Module failed to load.'));
    });
    await expect(exerciseInstalledBootstrap('/consumer')).rejects.toThrow();
    expect(mocks.closeBrowser).toHaveBeenCalledOnce();
    expect(mocks.closeServer).toHaveBeenCalledOnce();
  });

  it('propagates failed server cleanup', async () => {
    const { exerciseInstalledBootstrap } = await import('./browser.js');
    mocks.closeServer.mockImplementation((done: (error: Error) => void) => {
      done(new Error('Server cleanup failed.'));
    });
    await expect(exerciseInstalledBootstrap('/consumer')).rejects.toThrow('cleanup');
    expect(mocks.closeBrowser).toHaveBeenCalledOnce();
  });
});
