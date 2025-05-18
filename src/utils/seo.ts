interface MetaInfo {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export function updateMetaInfo(meta: MetaInfo) {
  // 更新標題
  if (meta.title) {
    // 如果是首頁，不添加後綴
    document.title = meta.title === '首頁' ? '抽獎助手' : `${meta.title} - 抽獎助手`;
  }

  // 更新 meta 描述
  if (meta.description) {
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', meta.description);
    }
  }

  // 更新 meta 關鍵字
  if (meta.keywords) {
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
      keywordsMeta.setAttribute('content', meta.keywords);
    }
  }

  // 更新 Open Graph meta 標籤
  if (meta.ogTitle) {
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      // 如果是首頁，不添加後綴
      ogTitleMeta.setAttribute('content', meta.ogTitle === '首頁' ? '抽獎助手' : `${meta.ogTitle} - 抽獎助手`);
    }
  }

  if (meta.ogDescription) {
    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) {
      ogDescMeta.setAttribute('content', meta.ogDescription);
    }
  }

  if (meta.ogImage) {
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', meta.ogImage);
    }
  }

  // 更新 Twitter Card meta 標籤
  if (meta.twitterTitle) {
    const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleMeta) {
      // 如果是首頁，不添加後綴
      twitterTitleMeta.setAttribute('content', meta.twitterTitle === '首頁' ? '抽獎助手' : `${meta.twitterTitle} - 抽獎助手`);
    }
  }

  if (meta.twitterDescription) {
    const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescMeta) {
      twitterDescMeta.setAttribute('content', meta.twitterDescription);
    }
  }

  if (meta.twitterImage) {
    const twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
    if (twitterImageMeta) {
      twitterImageMeta.setAttribute('content', meta.twitterImage);
    }
  }
} 