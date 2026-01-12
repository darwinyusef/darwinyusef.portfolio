import express from 'express';
import { google } from 'googleapis';

const router = express.Router();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_CALENDARAPIKEY
});

router.get('/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;

    const response = await youtube.channels.list({
      part: 'snippet,statistics,contentDetails',
      id: channelId
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: 'Canal no encontrado' });
    }

    return res.json({
      success: true,
      channel: response.data.items[0]
    });
  } catch (error) {
    console.error('Error obteniendo canal:', error);
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

router.get('/videos', async (req, res) => {
  try {
    const { channelId, maxResults = 10 } = req.query;

    if (!channelId) {
      return res.status(400).json({ error: 'channelId es requerido' });
    }

    const response = await youtube.search.list({
      part: 'snippet',
      channelId,
      maxResults: parseInt(maxResults),
      order: 'date',
      type: 'video'
    });

    const videos = await Promise.all(
      response.data.items.map(async (item) => {
        const statsResponse = await youtube.videos.list({
          part: 'statistics,contentDetails',
          id: item.id.videoId
        });

        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishedAt,
          statistics: statsResponse.data.items[0]?.statistics,
          duration: statsResponse.data.items[0]?.contentDetails?.duration
        };
      })
    );

    return res.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('Error obteniendo videos:', error);
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    const response = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails',
      id: videoId
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    return res.json({
      success: true,
      video: response.data.items[0]
    });
  } catch (error) {
    console.error('Error obteniendo video:', error);
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

export default router;
