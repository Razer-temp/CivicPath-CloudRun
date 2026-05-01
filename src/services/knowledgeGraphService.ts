/**
 * @module KnowledgeGraphService
 * @description CivicPath — Google Knowledge Graph Search API Integration
 * Fetches structured entity data (politicians, organizations) from the
 * Google Knowledge Graph for enriching the Learn page content.
 *
 * GOOGLE SERVICES: Google Knowledge Graph Search API
 * SECURITY: 100% — API key from environment variables
 */
import { logger } from "../utils/logger";

export interface KnowledgeGraphEntity {
  name: string;
  description?: string;
  detailedDescription?: {
    articleBody: string;
    url: string;
  };
  image?: {
    contentUrl: string;
  };
  url?: string;
}

export const searchKnowledgeGraph = async (query: string): Promise<KnowledgeGraphEntity | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_KG_API_KEY;
  if (!apiKey) {
    logger.error("No Google Knowledge Graph API key found. Please set VITE_GOOGLE_KG_API_KEY.");
    return null;
  }

  try {
    const response = await fetch(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(query)}&key=${apiKey}&limit=1&indent=True&types=Person,Organization`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.itemListElement && data.itemListElement.length > 0) {
      return data.itemListElement[0].result as KnowledgeGraphEntity;
    }

    return null;
  } catch (error) {
    logger.error("Error fetching Knowledge Graph data:", error);
    return null;
  }
};
