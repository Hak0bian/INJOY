import * as YUP from 'yup'

const registerValidation = () => {
    return YUP.object().shape({
        username: YUP
            .string()
            .trim()
            .min(2, "Min length is 2")
            .max(50, "Max length is 50")
            .required("Name is required")
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ'-\s]+$/, "Only letters, spaces, - or ' are allowed"),
        email: YUP
            .string()
            .min(5, "Min length is 5")
            .matches(/^[a-zA-Z0-9._%+-]+@/, "Invalid characters before @")
            .matches(/@/, "Email must contain @ symbol")
            .matches(/@[a-zA-Z0-9.-]+$/, "Invalid domain")
            .matches(/\.[a-zA-Z]{2,4}$/, "Domain must end with a valid extension (com, net)")
            .required("Email is required"),
        password: YUP
            .string()
            .min(5, "Min length is 5")
            .max(30, "Max length is 30")
            .required("Password is required")
            .matches(/[A-Z]/, "Password must contain one uppercase letter")
            .matches(/[a-z]/, "Password must contain one lowercase letter")
            .matches(/\d/, "Password must contain one number"),
    })
}

export default registerValidation