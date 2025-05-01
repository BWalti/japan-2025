import { defineEventHandler, setResponseHeader } from 'h3'
import RSS from 'rss'

export default defineEventHandler(async (event) => {
    // Fetch content from Nuxt Content v3
    const articles = await queryCollection(event, 'content')
        .where('published', '=', true)
        .order('date', 'DESC')
        .all()

    const publicUrl = useRuntimeConfig().public.appUrl;

    // Initialize the RSS feed
    const feed = new RSS({
        title: 'Beat\'s Japan 2025 Travelblog',
        description: 'Reiseberichte aus Japan',
        feed_url: `${publicUrl}/rss.xml`,
        site_url: publicUrl,
    })

    // Add articles to the feed
    articles.forEach((article) => {
        feed.item({
            title: article.title,
            description: article.description,
            url: `${publicUrl}${article.path}`,
            date: article.date,
        })
    })

    // Set response headers
    setResponseHeader(event, 'Content-Type', 'application/rss+xml')
    return feed.xml()
})
