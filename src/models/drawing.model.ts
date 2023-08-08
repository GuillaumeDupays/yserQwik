export interface DataPagination {
    drawing: Drawing[]
    meta?: Meta
}

export interface Drawing {
    id?: number
    attributes?: DrawingAttributes
}

export interface DrawingAttributes {
    title?: string
    description?: string
    date?: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    style?: string
    picture?: string
    // isSelected?: boolean
}

export interface Picture {
    data: Media[]
}

export interface Media {
    id: number
    attributes: MediaAttributes
}

export interface MediaAttributes {
    name: string
    alternativeText: null
    caption: null
    width: number
    height: number
    formats: Formats
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: null
    provider: string
    provider_metadata: null
    createdAt: Date
    updatedAt: Date
}

export interface Formats {
    thumbnail: Large
    small: Large
    medium: Large
    large?: Large
}

export interface Large {
    name: string
    hash: string
    ext: string
    mime: string
    path: null
    width: number
    height: number
    size: number
    url: string
}

export interface Meta {
    pagination: Pagination
}

export interface Pagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
}
