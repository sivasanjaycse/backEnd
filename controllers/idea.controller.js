const Idea = require('../models/Idea');
const User = require('../models/User');

// @desc    Submit a new idea
// @route   POST /api/ideas
exports.submitIdea = async (req, res) => {
  const { 
    projectTitle, description, supportNeeded, category, categoryOther,
    trlLevel, isWomanLed, hasWomanInTeam, isFromTier2or3, productLink,
    isTeam, teamMemberUserIds
  } = req.body;
  
  try {
    let teamMemberDocs = [];
    // Ensure isTeam is correctly interpreted from form-data (which sends strings)
    const isTeamProject = isTeam === 'true';

    if (isTeamProject && teamMemberUserIds) {
        const ids = Array.isArray(teamMemberUserIds) ? teamMemberUserIds : teamMemberUserIds.split(',').map(id => id.trim());
        if (ids.length > 0) {
            teamMemberDocs = await User.find({ userId: { $in: ids } });
            if (teamMemberDocs.length !== ids.length) {
                return res.status(400).json({ message: 'One or more team member User IDs are invalid.' });
            }
        }
    }

    const newIdeaData = {
      user: req.user._id,
      projectTitle, 
      description, 
      supportNeeded, 
      category, 
      trlLevel,
      isWomanLed: isWomanLed === 'true',
      hasWomanInTeam: hasWomanInTeam === 'true',
      isFromTier2or3: isFromTier2or3 === 'true',
      productLink,
      isTeam: isTeamProject,
      teamMembers: teamMemberDocs.map(doc => doc._id)
    };
    
    if (category === 'Other' && categoryOther) {
        newIdeaData.categoryOther = categoryOther;
    }

    // Check if a file was uploaded by multer
    if (req.file) {
      // We store the path to the file, which will be served statically
      newIdeaData.proposalFilePath = req.file.path;
    }

    const idea = new Idea(newIdeaData);
    await idea.save();

    // If it's a team idea, update each team member's profile
    if (isTeamProject && teamMemberDocs.length > 0) {
      const ideaId = idea._id;
      const updatePromises = teamMemberDocs.map(member => 
        User.findByIdAndUpdate(member._id, { $push: { teamIdeas: ideaId } })
      );
      await Promise.all(updatePromises);
    }
    
    res.status(201).json(idea);
  } catch (error) {
    console.error('Error submitting idea:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all ideas (Admin only)
// @route   GET /api/ideas
exports.getAllIdeas = async (req, res) => {
    try {
      const ideas = await Idea.find({}).populate('user', 'userId email').sort({ createdAt: -1 });
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  
// @desc    Update idea status or add comment (Admin only)
// @route   PUT /api/ideas/:id
exports.updateIdea = async (req, res) => {
    const { status, comment } = req.body;
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) {
        return res.status(404).json({ message: 'Idea not found' });
      }
      if (status) {
        idea.status = status;
      }
      if (comment) {
        idea.adminActions.push({ comment });
      }
      await idea.save();
      res.json(idea);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};