/**
 * Middleware de validación con Zod
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    const errors = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    
    res.status(400).json({
      error: true,
      message: 'Error de validación',
      details: errors
    });
  }
};
