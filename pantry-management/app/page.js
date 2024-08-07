'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, MenuItem, Select, InputLabel, FormControl, Pagination } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const getRecipeSuggestions = async (ingredients) => {
    const OPENROUTER_API_KEY = ''; // Replace with your OpenRouter API key
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

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [filteredInventory, setFilteredInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [itemCategory, setItemCategory] = useState('')
    const [itemQuantity, setItemQuantity] = useState(1)
    const [editMode, setEditMode] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [categories, setCategories] = useState(['Food', 'Electronics', 'Furniture']) // Add more categories as needed
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [page, setPage] = useState(1)
    const itemsPerPage = 5
    const [recipeIngredients, setRecipeIngredients] = useState('');
    const [recipeSuggestions, setRecipeSuggestions] = useState('');

    const handleGetRecipeSuggestions = async () => {
        const ingredientsArray = recipeIngredients.split(',').map(item => item.trim());
        const suggestions = await getRecipeSuggestions(ingredientsArray);
        setRecipeSuggestions(suggestions);
    };

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
            inventoryList.push({ name: doc.id, ...doc.data() })
        })
        setInventory(inventoryList)
        }

    useEffect(() => {
        updateInventory();
    }, []);

    useEffect(() => {
        // Filter the inventory based on search query and selected category
        const filtered = inventory.filter(item => 
            (item.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedCategory === '' || item.category === selectedCategory)
        );
        setFilteredInventory(filtered);
        setPage(1); // Reset page to 1 on filter change
    }, [searchQuery, selectedCategory, inventory]);

    const addOrUpdateItem = async () => {
        if (itemName.trim() === '' || itemCategory.trim() === '' || itemQuantity <= 0) return;

        const docRef = doc(collection(firestore, 'inventory'), itemName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Update item
            const { quantity } = docSnap.data();
            await setDoc(docRef, { quantity: itemQuantity, category: itemCategory });
        } else {
            // Add new item
            await setDoc(docRef, { quantity: itemQuantity, category: itemCategory });
        }
        setItemName('');
        setItemCategory('');
        setItemQuantity(1);
        setEditMode(false);
        setEditItem(null);
        await updateInventory();
    };

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - 1 })
            }
            }
            await updateInventory()
        }

    const handleOpen = (item = null) => {
        if (item) {
            setItemName(item.name);
            setItemCategory(item.category);
            setItemQuantity(item.quantity);
            setEditMode(true);
            setEditItem(item.name);
        } else {
            setItemName('');
            setItemCategory('');
            setItemQuantity(1);
            setEditMode(false);
            setEditItem(null);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const paginatedInventory = filteredInventory.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box
        width="100vw"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        p={2}
        >
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {editMode ? 'Update Item' : 'Add Item'}
            </Typography>
            <Stack width="100%" spacing={2}>
                <TextField
                id="item-name"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        value={itemCategory}
                        onChange={(e) => setItemCategory(e.target.value)}
                        label="Category"
                    >
                        {categories.map(category => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    id="item-quantity"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={itemQuantity}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === "0") {
                            setItemQuantity("");
                        } else {
                            setItemQuantity(Number(value));
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value === "" || e.target.value === "0") {
                            setItemQuantity(1); // Ensure minimum value is 1
                        }
                    }}
                    InputProps={{
                        inputProps: { min: 1 } // Ensures quantity can't be less than 1
                    }}
                />
                <Button
                variant="outlined"
                onClick={() => {
                    addOrUpdateItem();
                    handleClose();
                }}
                >
                {editMode ? 'Update' : 'Add'}
                </Button>
            </Stack>
            </Box>
        </Modal>
        <Button variant="contained" onClick={() => handleOpen()}>
            Add New Item
        </Button>
        <Stack spacing={2} width="100%" maxWidth="800px" padding={2}>
            <TextField
                label="Search Items"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl fullWidth>
                <InputLabel id="filter-category-label">Filter by Category</InputLabel>
                <Select
                    labelId="filter-category-label"
                    id="filter-category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Filter by Category"
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map(category => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
        <Box border={'1px solid #333'}>
            <Box
            width="100%"
            maxWidth="800px"
            height="100px"
            bgcolor={'#ADD8E6'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
                Inventory Items
            </Typography>
            </Box>
            <Stack width="100%" maxWidth="800px" spacing={2} padding={2}>
            {paginatedInventory.map(({name, quantity, category}) => (
                <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={3}
                paddingY={1}
                borderRadius={1}
                boxShadow={1}
                >
                <Stack spacing={1}>
                    <Typography variant={'h5'} color={'#333'}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant={'body1'} color={'#333'}>
                        Quantity: {quantity}
                    </Typography>
                    <Typography variant={'body1'} color={'#333'}>
                        Category: {category}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => handleOpen({ name, category, quantity })}>
                        Edit
                    </Button>
                    <Button variant="contained" onClick={() => removeItem(name)}>
                        Remove
                    </Button>
                </Stack>
                </Box>
            ))}
            </Stack>
            <Stack spacing={2} width="100%" maxWidth="800px" padding={2}>
                <TextField
                    label="Enter Ingredients for Recipe (comma-separated)"
                    variant="outlined"
                    fullWidth
                    value={recipeIngredients}
                    onChange={(e) => setRecipeIngredients(e.target.value)}
                />
                <Button variant="contained" onClick={handleGetRecipeSuggestions}>
                    Get Recipe Suggestions
                </Button>
                {recipeSuggestions && (
                    <Typography variant="body1" color="textPrimary" marginTop={2}>
                        {recipeSuggestions}
                    </Typography>
                )}
            </Stack>
    
            <Pagination
                count={Math.ceil(inventory.length / itemsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
            />
        </Box>
        </Box>
    );
}
