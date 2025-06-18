import React from 'react'
import Head from 'next/head'

interface SEOProps {
    title?: string
    description?: string
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article' | 'product'
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
}

const defaultSEO = {
    title: "PeanechWeb - Futuristic AI Infrastructure",
    description: "Next-generation AI infrastructure with cyberpunk design, featuring local LLM deployment, advanced monitoring, and cutting-edge user experience.",
    keywords: ["AI", "Local LLM", "DeepSeek", "Qwen", "FastAPI", "Ollama", "Cyberpunk", "Futuristic UI", "Three.js", "React", "Next.js"],
    image: "/og-image.webp",
    url: "https://peanech.online",
    type: "website" as const,
    author: "PeanechWeb Team"
}

export function SEOHead({
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    image = defaultSEO.image,
    url = defaultSEO.url,
    type = defaultSEO.type,
    publishedTime,
    modifiedTime,
    author = defaultSEO.author,
    section,
    tags = []
}: SEOProps) {
    const fullTitle = title === defaultSEO.title ? title : `${title} | PeanechWeb`
    const fullUrl = url.startsWith('http') ? url : `${defaultSEO.url}${url}`
    const fullImage = image.startsWith('http') ? image : `${defaultSEO.url}${image}`

    // Generate structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": type === 'article' ? 'Article' : 'WebSite',
        name: fullTitle,
        description,
        url: fullUrl,
        image: fullImage,
        author: {
            "@type": "Organization",
            name: author,
            url: defaultSEO.url
        },
        publisher: {
            "@type": "Organization",
            name: "PeanechWeb",
            url: defaultSEO.url,
            logo: {
                "@type": "ImageObject",
                url: `${defaultSEO.url}/logo.webp`
            }
        },
        ...(publishedTime && { datePublished: publishedTime }),
        ...(modifiedTime && { dateModified: modifiedTime }),
        ...(section && { articleSection: section }),
        ...(tags.length > 0 && { keywords: tags.join(', ') })
    }

    return (
        <Head>
            {/* Basic meta tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="author" content={author} />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content="PeanechWeb" />
            <meta property="og:locale" content="en_US" />

            {type === 'article' && (
                <>
                    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
                    {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
                    {author && <meta property="article:author" content={author} />}
                    {section && <meta property="article:section" content={section} />}
                    {tags.map(tag => (
                        <meta key={tag} property="article:tag" content={tag} />
                    ))}
                </>
            )}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
            <meta name="twitter:site" content="@peanechWeb" />
            <meta name="twitter:creator" content="@peanechWeb" />            {/* Additional meta tags for better SEO */}
            {/* Theme color for browsers that support it */}
            <meta name="theme-color" content="#85FF90" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
            <meta name="msapplication-TileColor" content="#1a1a1a" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="color-scheme" content="dark light" />{/* Favicon and app icons */}
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="msapplication-config" content="/browserconfig.xml" />

            {/* Preconnect to external domains for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            {/* Structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </Head>
    )
}

// Page-specific SEO components
export const HomeSEO = () => (
    <SEOHead
        title="PeanechWeb - Futuristic AI Infrastructure Platform"
        description="Experience the future of AI with our cyberpunk-inspired platform featuring local LLM deployment, advanced monitoring, and cutting-edge user interface design."
        keywords={["AI Platform", "Local LLM", "DeepSeek R1", "Qwen 3", "AI Infrastructure", "Cyberpunk UI", "Futuristic Design"]}
    />
)

export const TeamSEO = () => (
    <SEOHead
        title="Our Team - Meet the Innovators Behind PeanechWeb"
        description="Discover the brilliant minds shaping the future of AI technology. Our diverse team of engineers, designers, and AI specialists."
        url="/team"
        keywords={["AI Team", "Tech Team", "AI Engineers", "Machine Learning Experts", "Innovation Team"]}
    />
)

export const AboutSEO = () => (
    <SEOHead
        title="About PeanechWeb - Building the Future of AI"
        description="Learn about our mission to democratize AI technology and create innovative solutions that make a difference in the world."
        url="/about"
        keywords={["About AI Company", "AI Mission", "Technology Innovation", "AI Vision", "Future of AI"]}
    />
)

export const ContactSEO = () => (
    <SEOHead
        title="Contact PeanechWeb - Get in Touch with AI Experts"
        description="Ready to transform your business with AI? Contact our team of experts for consultation, partnerships, or technical support."
        url="/contact"
        keywords={["Contact AI Company", "AI Consultation", "AI Support", "Business AI Solutions"]}
    />
)

export const PricingSEO = () => (
    <SEOHead
        title="Pricing Plans - Choose Your AI Infrastructure Solution"
        description="Flexible pricing plans for every need. From startups to enterprises, find the perfect AI infrastructure solution for your organization."
        url="/pricing"
        keywords={["AI Pricing", "AI Plans", "Enterprise AI", "AI Infrastructure Cost", "AI Subscription"]}
    />
)

export default SEOHead
