'use client';

import { useState } from 'react';
import { useTranslation } from '@/components/i18n/TranslationContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function ClientTranslationForm() {
  const { t, locale: lang } = useTranslation();
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cookingTime: 30,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving
    setIsSaving(true);
    setSaveMessage(null);
    
    // Fake API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage(t('recipe.savedSuccessfully') || 'Recipe saved successfully!');
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="animate-pulse">...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded-md" />
          <div className="h-24 bg-muted animate-pulse rounded-md" />
          <div className="h-24 bg-muted animate-pulse rounded-md" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('recipe.createRecipe')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('recipe.title')}</Label>
            <Input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder={t('recipe.titlePlaceholder') || "Enter recipe title"}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">{t('recipe.description')}</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              value={formState.description}
              onChange={handleChange}
              placeholder={t('recipe.descriptionPlaceholder') || "Brief description of the recipe"}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ingredients">{t('recipe.ingredients')}</Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              rows={4}
              value={formState.ingredients}
              onChange={handleChange}
              placeholder={t('recipe.ingredientsPlaceholder') || "List ingredients, one per line"}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="instructions">{t('recipe.instructions')}</Label>
            <Textarea
              id="instructions"
              name="instructions"
              rows={4}
              value={formState.instructions}
              onChange={handleChange}
              placeholder={t('recipe.instructionsPlaceholder') || "List preparation steps"}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cookingTime">
              {t('recipe.cookingTime')} ({t('recipe.minutes')})
            </Label>
            <Input
              id="cookingTime"
              name="cookingTime"
              type="number"
              min="1"
              value={formState.cookingTime}
              onChange={handleChange}
            />
          </div>
          
          {saveMessage && (
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-2 rounded">
              {saveMessage}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 