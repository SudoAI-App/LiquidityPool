const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const textOf = (node) => node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

// A guide's source list is the ordered list whose every item is exactly one link.
const referenceLink = (item) => {
  const paragraph = item.children?.length === 1 ? item.children[0] : null;
  const only = paragraph?.type === 'paragraph' && paragraph.children?.length === 1 ? paragraph.children[0] : null;
  return only?.type === 'link' ? only : null;
};

/**
 * Guides cite sources as `[1]`, a shortcut reference that markdown resolves to a bare
 * link reading "1" — mid-sentence it looks like part of the prose ("the same number 1").
 * This renders each citation as a bracketed superscript that jumps to its entry in the
 * source list, and gives that list stable `#ref-N` anchors.
 */
export const satteriCitations = {
  name: 'satteri-citations',
  linkReference(node, ctx) {
    if (!/^\d{1,2}$/.test(node.identifier ?? '')) return;
    const n = node.identifier;
    // Prose is written "the same number [1]." — a superscript sits flush against its word.
    const index = ctx.indexOf(node);
    const previous = index ? ctx.parent(node)?.children?.[index - 1] : undefined;
    if (previous?.type === 'text' && /\s$/.test(previous.value)) ctx.setProperty(previous, 'value', previous.value.replace(/\s+$/, ''));
    ctx.replaceNode(node, {
      type: 'html',
      value: `<sup class="cite"><a href="#ref-${n}" aria-label="Source ${n}">[${n}]</a></sup>`,
    });
  },
  list(node, ctx) {
    if (!node.ordered || !node.children?.length) return;
    const links = node.children.map(referenceLink);
    if (links.some((link) => !link || !/^https?:\/\//.test(link.url))) return;
    const start = node.start ?? 1;
    const items = links.map((link, index) => (
      `<li id="ref-${start + index}"><a href="${escapeHtml(link.url)}" rel="noopener">${escapeHtml(textOf(link))}</a></li>`
    ));
    ctx.replaceNode(node, { type: 'html', value: `<ol class="references"${start === 1 ? '' : ` start="${start}"`}>${items.join('')}</ol>` });
  },
};
