Hosted at [thepatrickfisher.com](https://thepatrickfisher.com)

## Zola 0.23.2 migration

This site has been migrated to [Zola 0.23.2](https://github.com/getzola/zola/releases/tag/v0.23.2).

- Reusable article shortcodes were replaced by Tera 2 components in `templates/components.html`, including `code_block`, `markdown_block`, and `figure`.
- Article content now calls those components directly instead of using the shortcode system removed in Zola 0.23.
- RSS generation continues to use `generate_feeds` with `feed_filenames`, and syntax highlighting remains configured under `[markdown.highlighting]`.
