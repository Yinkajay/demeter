import { useFieldArray, useForm } from "react-hook-form"
import useAuthStore from "../store/useAuthStore"
import { useState } from "react"
import { uploadToCloudinary } from "../lib/cloudinary"
import { toast } from "sonner"

const CreateRecipe = () => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      steps: [''],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps'
  })

  console.log('FIELDS:', fields);

  const { token } = useAuthStore()

  // const [steps, setSteps] = useState([""]);

  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [images, setImages] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );

    const allowed = droppedFiles.slice(0, 3 - images.length);
    if (allowed.length > 0) {
      setImages((prev) => [...prev, ...allowed]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && images.length < 3) {
      setImages((prev) => [...prev, file]);
    }
  };

  const handleRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/ingredients/suggest?q=${query}`, {
        method: 'GET'
      })
      const result = await response.json()
      console.log(result)
      setSuggestions(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setInputValue("");
    setSuggestions([]);
  };

  const removeIngredient = (index) => {
    const newList = [...ingredients];
    newList.splice(index, 1);
    setIngredients(newList);
  };

  const addRecipeHandler = async (data) => {
    console.log(data)
    const uploadedImageUrls = [];

    for (const file of images) {
      const url = await uploadToCloudinary(file);
      uploadedImageUrls.push(url);
    }

    console.log(uploadedImageUrls)

    const ings = []

    for (const ing of ingredients) {
      ings.push({ name: ing })
    }

    console.log(ings)
    try {
      const recipeData = {
        title: data.title,
        description: data.description,
        cook_time: data.cookTime,
        instructions: data.steps,
        image_urls: uploadedImageUrls,
        ingredients: ings
      }

      const response = await fetch('http://localhost:5000/api/recipes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      })
      toast.success('Recipe successfully created!', {
        position: 'top-center'
      })
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  return (
    <div>
      <h1 className="text-center my-3 text-2xl">Create Recipe</h1>
      <section className="p-4">
        <form onSubmit={handleSubmit(addRecipeHandler)} className="my-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              className="border p-2 rounded-md focus:outline-none focus:ring-0"
              placeholder="Recipe title or name"
              required
              {...register("title")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="title">Description</label>
            <textarea
              id="description"
              name="description"
              // type="text"
              className="border p-2 rounded-md focus:outline-none focus:ring-0"
              placeholder="Recipe description"
              required
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cookTime">Cook Time</label>
            <input
              id="cookTime"
              name="cookTime"
              type="number"
              className="border p-2 rounded-md focus:outline-none focus:ring-0"
              placeholder="Recipe description or name"
              required
              {...register("cookTime")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Instructions / Steps</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <textarea
                  // value={step}
                  // onChange={(e) => updateStep(index, e.target.value)}
                  className="border p-2 rounded-md w-full"
                  placeholder={`Step ${index + 1}`}
                  {...register(`steps[${index}]`, { required: true })}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append('')}
              className="text-sm  text-white bg-[#444] border w-max p-2 rounded mx-auto"
            >
              + Add step
            </button>
          </div>

          <div className="w-full">
            <label>Ingredients</label>
            {/* Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
              {ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(i)}
                    className="ml-2 text-gray-600 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input with suggestions */}
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(value);
                  fetchSuggestions(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim() !== '') {
                    e.preventDefault();
                    addIngredient(inputValue.trim());
                    setInputValue('');
                  }
                }}
                className="border p-2 rounded-md w-full"
                placeholder="Add an ingredient"
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
                  {suggestions.map((sugg, i) => (
                    <li
                      key={i}
                      onClick={() => addIngredient(sugg.name)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {sugg.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="my-4">
            <label>Images</label>
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 my-4 border-dashed border-gray-400 p-6 text-center rounded-md cursor-pointer hover:border-gray-600"
              onClick={() => document.getElementById("imageInput").click()}
            >
              <p className="text-gray-600">Drag and drop images here, or click to select (max. 3)</p>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Preview thumbnails */}
            <div className="my-4 flex gap-4 flex-wrap">
              {images.map((file, index) => (
                <div key={index} className="relative w-24 h-24 group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>



          <button className="my-3 border p-3 cursor-pointer">
            Create recipe
          </button>

        </form>
      </section>
    </div>
  )
}

export default CreateRecipe

{/* <div className="space-y-4">
  <label htmlFor="">Add images of your recipes</label>
  {images.length < 3 && (
    <>
      <div className="file-upload">
        <label className="custom-file-label" htmlFor="upload">Upload some recipe images</label>
        <input type="file" id="upload" accept="image/*" onChange={handleAddImage} />
      </div>
    </>
  )}

  <div className="flex my-3">
    {images.map((file, index) => (
      <div key={index} className="flex items-center space-x-4">
        <img
          src={URL.createObjectURL(file)}
          alt={`Preview ${index + 1}`}
          className="w-24 h-24 object-cover rounded"
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          className="text-red-500 text-sm mr-6 hover:underline"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
</div> */}