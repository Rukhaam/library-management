// VALIDATE EMAIL FORMAT
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// VALIDATE PASSWORD STRENGTH/LENGTH
export const isValidPassword = (password) => {
    if (!password) return false;
    
    // 1. Check length (between 8 and 16 characters)
    if (password.length < 8 || password.length > 16) return false;

    // 2. Must contain at least one number
    const hasNumber = /\d/.test(password);
    if (!hasNumber) return false;

    // 3. Must contain at least one uppercase letter
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) return false;

    // 4. Must contain at least one lowercase letter
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) return false;

    // 5. Must contain at least one special character
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialChar) return false;

    // If it passes all tests, it's a strong password!
    return true;
};