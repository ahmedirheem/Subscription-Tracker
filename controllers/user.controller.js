import User from '../models/user.model.js'

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      date: {
        users
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      // const error = new Error('User not found');
      // error.statusCode = 404;
      // throw error;

      throw new ApiError(404, "User not founds")
    }

    res.status(200).json({
      success: true,
      date: {
        user
      }
    })
  } catch (error) {
    next(error)
  }
}