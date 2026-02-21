'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CategoryFilterProps {
    selectedCategory: string | null;
    onSelectCategory: (slug: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (data) {
                setCategories(data);
            }
        };

        fetchCategories();
    }, [supabase]);

    return (
        <div className="flex flex-wrap items-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <button
                onClick={() => onSelectCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === null
                        ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                    }`}
            >
                Latest
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === category.slug
                            ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
