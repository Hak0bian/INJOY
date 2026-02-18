import * as YUP from 'yup'

const setupValidation = YUP.object({
    username: YUP
        .string()
        .required("Username is required")
        .min(3, "Must be at least 3 characters")
        .max(25, "Max lenght is 25")
});

export default setupValidation