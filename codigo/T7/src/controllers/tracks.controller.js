import { tracksModel } from '../models/index.js';
import { handleHttpError } from '../utils/handleError.js';

/**
 * Listar tracks
 * GET /api/tracks
 */
export const getTracks = async (req, res) => {
  try {
    const data = await tracksModel.find({}).populate('artist', 'name email');
    res.send({ data });
  } catch (err) {
    handleHttpError(res, 'ERROR_GET_TRACKS');
  }
};

/**
 * Obtener track por ID
 * GET /api/tracks/:id
 */
export const getTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tracksModel.findById(id).populate('artist', 'name email');
    
    if (!data) {
      handleHttpError(res, 'TRACK_NOT_FOUND', 404);
      return;
    }
    
    res.send({ data });
  } catch (err) {
    handleHttpError(res, 'ERROR_GET_TRACK');
  }
};

/**
 * Crear track
 * POST /api/tracks
 */
export const createTrack = async (req, res) => {
  try {
    // El usuario autenticado es el artista
    const body = {
      ...req.body,
      artist: req.user._id
    };
    
    const data = await tracksModel.create(body);
    
    res.status(201).send({ 
      data,
      createdBy: req.user.name
    });
  } catch (err) {
    handleHttpError(res, 'ERROR_CREATE_TRACK');
  }
};

/**
 * Actualizar track
 * PUT /api/tracks/:id
 */
export const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await tracksModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('artist', 'name email');
    
    if (!data) {
      handleHttpError(res, 'TRACK_NOT_FOUND', 404);
      return;
    }
    
    res.send({ data });
  } catch (err) {
    handleHttpError(res, 'ERROR_UPDATE_TRACK');
  }
};

/**
 * Eliminar track
 * DELETE /api/tracks/:id
 */
export const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await tracksModel.findByIdAndDelete(id);
    
    if (!data) {
      handleHttpError(res, 'TRACK_NOT_FOUND', 404);
      return;
    }
    
    res.send({ message: 'Track eliminado', id: data._id });
  } catch (err) {
    handleHttpError(res, 'ERROR_DELETE_TRACK');
  }
};
