
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Save, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const JournalSection = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<Array<{id: string, content: string, created_at: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching journal entries:', error);
        return;
      }

      setSavedEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const saveEntry = async () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Empty Journal",
        description: "Please write something before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your journal entry.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('journal_entries')
        .insert([
          {
            content: journalEntry,
            user_id: user.id
          }
        ]);

      if (error) {
        console.error('Error saving journal entry:', error);
        toast({
          title: "Error",
          description: "Failed to save journal entry. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      setJournalEntry('');
      await fetchJournalEntries(); // Refresh the entries list
      
      toast({
        title: "Journal Saved",
        description: "Your thoughts have been safely saved.",
      });
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-slate-700">
          <BookOpen className="h-6 w-6 text-blue-500" />
          <span>Personal Journal</span>
        </CardTitle>
        <p className="text-slate-500 text-sm">Express your thoughts and feelings in a safe space</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's on your mind today? Write about your feelings, experiences, or anything you'd like to reflect on..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="min-h-[200px] border-slate-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
        />
        
        <Button 
          onClick={saveEntry}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Entry'}
        </Button>

        {savedEntries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-600 mb-3 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Recent Entries
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-3 bg-white/70 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">{new Date(entry.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalSection;
