export const getRecipeSuggestions = async (ingredients) => {
    const OPENROUTER_API_KEY = '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'; // Replace with your OpenRouter API key
    const YOUR_SITE_URL = 'https://your-site-url.com'; // Replace with your site URL
    const YOUR_SITE_NAME = 'Your Site Name'; // Replace with your site name

    const prompt = `Suggest a recipe using the following ingredients: ${ingredients.join(', ')}`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": YOUR_SITE_URL,
            "X-Title": YOUR_SITE_NAME,
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                { "role": "user", "content": prompt },
            ],
            })
        });

        const data = await response.json();
        const recipeSuggestions = data.choices[0].message.content.trim();
        return recipeSuggestions;
        } catch (error) {
        console.error('Error getting recipe suggestions:', error);
        return 'Unable to fetch recipe suggestions at the moment.';
        }
};
