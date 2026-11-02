import type { Locator } from '@playwright/test';

export function paintedColors(control: Locator) {
  return control.evaluate((element) => {
    type RGB = { r: number; g: number; b: number };
    type RGBA = RGB & { alpha: number };
    function parse(value: string): RGBA {
      const channels = value.match(
        /^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/,
      );
      if (!channels) throw new Error(`Unsupported measured color: ${value}`);
      return { r: Number(channels[1]), g: Number(channels[2]),
        b: Number(channels[3]), alpha: Number(channels[4] ?? 1) };
    }
    function over(front: RGBA, back: RGB): RGB {
      return {
        r: front.r * front.alpha + back.r * (1 - front.alpha),
        g: front.g * front.alpha + back.g * (1 - front.alpha),
        b: front.b * front.alpha + back.b * (1 - front.alpha),
      };
    }
    function hex(value: RGB) {
      return '#' + [value.r, value.g, value.b]
        .map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('');
    }
    const layers: RGBA[] = [];
    for (let node: Element | null = element; node; node = node.parentElement) {
      const background = parse(getComputedStyle(node).backgroundColor);
      layers.push(background);
      if (background.alpha === 1) break;
    }
    if (!layers.some(layer => layer.alpha === 1))
      throw new Error('A visible control needs an opaque native background.');
    let background: RGB = { r: 0, g: 0, b: 0 };
    for (const layer of layers.reverse()) background = over(layer, background);
    return {
      foreground: hex(over(parse(getComputedStyle(element).color), background)),
      background: hex(background),
    };
  });
}
