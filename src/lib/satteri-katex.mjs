import katex from 'katex';

function render(tex, displayMode, node, ctx) {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      output: 'htmlAndMathml'
    });
  } catch (error) {
    ctx.report({ message: `KaTeX failed on "${tex}": ${error.message}`, node, severity: 'warning' });
    return null;
  }
}

/**
 * Renders Sätteri's math nodes with KaTeX at build time and splices the result
 * in as raw HTML. Runs in the mdast phase so the output never reaches the
 * syntax highlighter. The browser needs no JS: `public/katex/katex.min.css`
 * plus the self-hosted woff2 fonts are the whole runtime.
 */
export const satteriKatex = {
  name: 'satteri-katex',
  math(node, ctx) {
    const tex = String(node.value ?? '').trim();
    if (!tex) return;
    const html = render(tex, true, node, ctx);
    if (html) ctx.replaceNode(node, { type: 'html', value: html });
  },
  inlineMath(node, ctx) {
    const tex = String(node.value ?? '').trim();
    if (!tex) return;
    const html = render(tex, false, node, ctx);
    if (html) ctx.replaceNode(node, { type: 'html', value: html });
  }
};
