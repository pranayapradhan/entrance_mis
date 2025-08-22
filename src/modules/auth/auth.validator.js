import Joi from "joi"

const EmailDTO = Joi.string().email().required()
const PasswordDTO = Joi.string().min(8).max(30).required()

const RegisterDTO = Joi.object({
    name : Joi.string().min(2).max(30).required(),
    // .messages({
    //     "string-min":"name should be of min 3 character long"
    // }),
    email: EmailDTO,
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*_])([a-zA-Z\d!@#$%^&*_]){8,30}$/).required(),
    confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
        "any.only": "Password and confirm password should be same"
    }),
    phone: Joi.string().regex(/^(?:\+977[- ]?)?(?:\d{1,3}[- ]?)?(\d){6,10}$/).allow(null,"").optional().default(null),
    address: Joi.object({
        permanentAddress: Joi.string().max(100).allow(null,'').default(null),
        temporaryAddress: Joi.string().max(100).allow(null,'').default(null)
    }).allow(null,"").default(null),
    dob: Joi.date().allow(null,"").optional().default(null),
    role:Joi.string().regex(/^(student|admin|examiner)$/i).default('student'),
    gender: Joi.string().regex(/^(male|female|other)$/).optional().default(null),
    image: null,
    qualification: Joi.string().regex(/^(school|high-school|bachelor)$/).optional().default(null),
    faculty: Joi.string().allow(null,"").optional().default(null),
    institution: Joi.string().min(2).max(100).allow(null,"").optional().default(null),
    passedYear: Joi.string().max(4).allow(null,"").optional().default(null)    
})

const LoginDTO = Joi.object({
    email: EmailDTO,
    password: PasswordDTO
})

const ResetPasswordRequestDTO = Joi.object({
    email: EmailDTO
})

const ResetPasswordDataDTO = Joi.object({
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*_])([a-zA-Z\d!@#$%^&*_]){8,30}$/).required(),
    confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
        "any.only": "Password and confirm password should be same"
    })
})

export {
    RegisterDTO,
    LoginDTO,
    EmailDTO,
    ResetPasswordRequestDTO,
    ResetPasswordDataDTO
}