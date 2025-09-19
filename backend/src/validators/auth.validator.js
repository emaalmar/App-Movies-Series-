import { body } from 'express-validator'

export const signupValidator = [
  body('fullName')
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .notEmpty().withMessage('Correo requerido')
    .isEmail().withMessage('Correo electrónico inválido'),
  body('password')
    .notEmpty().withMessage('Contraseña requerida')
    .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
]

export const signinValidator = [
  body('email')
    .notEmpty().withMessage('Correo requerido')
    .isEmail().withMessage('Correo electrónico inválido'),
  body('password')
    .notEmpty().withMessage('Contraseña requerida')
]


export const profileValidator = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Correo electrónico inválido')
]

export const passwordChangeValidator = [
  body('currentPassword')
    .notEmpty().withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .notEmpty().withMessage('La nueva contraseña es requerida')
    .isLength({ min: 6, max: 100 }).withMessage('La nueva contraseña debe tener entre 6 y 100 caracteres')
    .matches(/[A-Z]/).withMessage('La nueva contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/).withMessage('La nueva contraseña debe contener al menos un número')
]
