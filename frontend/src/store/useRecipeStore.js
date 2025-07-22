import { create } from "zustand";
import { persist } from "zustand/middleware";


const useRecipeStore = create(persist((set) => ({
    savedRecipeIds: [],
    setRecipeIds: (ids) => set({ savedRecipeIds: ids }),
    toggleSavedRecipe: (id) =>
        set((state) => {
            const isSaved = state.savedRecipeIds.includes(id)
            return {
                savedRecipeIds: isSaved
                    ? state.savedRecipeIds.filter((r) => r !== id)
                    : [...state.savedRecipeIds, id]
            }
        })
}),
    {
        name: 'saved-recipe-ids',
    }
))
export default useRecipeStore