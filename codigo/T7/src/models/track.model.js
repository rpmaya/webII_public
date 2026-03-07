import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      maxlength: [200, 'Máximo 200 caracteres']
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El artista es requerido']
    },
    duration: {
      type: Number,
      required: [true, 'La duración es requerida'],
      min: [1, 'Mínimo 1 segundo']
    },
    genres: {
      type: [String],
      validate: {
        validator: (v) => v && v.length > 0,
        message: 'Debe tener al menos un género'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices
trackSchema.index({ artist: 1 });

const Track = mongoose.model('Track', trackSchema);

export default Track;
