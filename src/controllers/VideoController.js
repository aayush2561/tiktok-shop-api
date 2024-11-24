import Video from '../models/VideoModel.js'; 

export const createVideoController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId=req.user.id;
    const result=await cloudinary.uploader.upload(req.file.path);
    const videoUrl = result.secure_url; 

    const newVideo = new Video({
      title,
      description,
      videoUrl,
      userId,
    });
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVideoByIdController = async (req, res) => {
  try {
    const videoId = req.params.id; 
    const video = await Video.findById(videoId); 

    if (!video) {
      return res.status(404).json({ message: 'Video not found' }); 
    }

    res.status(200).json(video); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteVideoByIdController = async (req, res) => {
  try {
    const videoId = req.params.id; 

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' }); 
    }

    res.status(200).json({ message: 'Video deleted successfully' }); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const interactWithVideoController = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id; 
    const { interactionType, commentText } = req.body; 

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (interactionType === 'like') {
      if (video.likes.includes(userId)) {
        return res.status(400).json({ message: 'You have already liked this video' });
      }
      video.likes.push(userId);
      await video.save();
      return res.status(200).json({ message: 'Video liked successfully', likes: video.likes.length });
    }

    if (interactionType === 'comment') {
      if (!commentText || commentText.trim().length === 0) {
        return res.status(400).json({ message: 'Comment text is required' });
      }

      const newComment = {
        userId,
        commentText,
        timestamp: new Date(),
      };
      video.comments.push(newComment);
      await video.save();
      return res.status(200).json({ message: 'Comment added successfully', comment: newComment });
    }
    return res.status(400).json({ message: 'Invalid interaction type. Must be "like" or "comment".' });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
