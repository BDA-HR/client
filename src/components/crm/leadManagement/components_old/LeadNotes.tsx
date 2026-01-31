import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FileText, Clock, User } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Badge } from '../../../ui/badge';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  isPrivate: boolean;
  tags: string[];
}

interface LeadNotesProps {
  leadId: string;
}

export default function LeadNotes({ leadId }: LeadNotesProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Initial conversation went well. Client is interested in our enterprise solution and has budget allocated for Q2. They mentioned current pain points with their existing system and are looking for better reporting capabilities.',
      createdAt: '2024-01-18T10:30:00Z',
      createdBy: 'Sarah Johnson',
      isPrivate: false,
      tags: ['budget-confirmed', 'pain-points']
    },
    {
      id: '2',
      content: 'Follow-up call scheduled for next week. Need to prepare technical demo focusing on reporting and analytics features. Client specifically asked about integration with their existing ERP system.',
      createdAt: '2024-01-17T14:20:00Z',
      createdBy: 'Sarah Johnson',
      updatedAt: '2024-01-17T15:00:00Z',
      isPrivate: false,
      tags: ['demo-scheduled', 'integration']
    },
    {
      id: '3',
      content: 'Internal note: This lead has high potential. Similar profile to our best customers. Consider fast-tracking through sales process.',
      createdAt: '2024-01-16T09:15:00Z',
      createdBy: 'Sarah Johnson',
      isPrivate: true,
      tags: ['high-potential', 'internal']
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    content: '',
    isPrivate: false,
    tags: ''
  });

  const handleAddNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      content: newNote.content,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      isPrivate: newNote.isPrivate,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setNotes([note, ...notes]);
    setNewNote({ content: '', isPrivate: false, tags: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditNote = () => {
    if (editingNote) {
      const updatedNotes = notes.map(note => 
        note.id === editingNote.id 
          ? { 
              ...editingNote, 
              updatedAt: new Date().toISOString(),
              tags: typeof editingNote.tags === 'string' 
                ? (editingNote.tags as string).split(',').map(tag => tag.trim()).filter(tag => tag)
                : editingNote.tags
            }
          : note
      );
      setNotes(updatedNotes);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes & Comments</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="noteContent">Note Content</Label>
                <Textarea
                  id="noteContent"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Enter your note here..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="noteTags">Tags (comma-separated)</Label>
                <input
                  id="noteTags"
                  type="text"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                  placeholder="e.g., important, follow-up, budget"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="isPrivate"
                  type="checkbox"
                  checked={newNote.isPrivate}
                  onChange={(e) => setNewNote({...newNote, isPrivate: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <Label htmlFor="isPrivate">Private note (only visible to you)</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote} className="bg-orange-600 hover:bg-orange-700">
                  Add Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes List */}
      <Card>
        <CardContent className="pt-6">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
              <p className="text-gray-500 mb-4">Add notes to track important information about this lead</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Note
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">{note.createdBy}</span>
                      {note.isPrivate && (
                        <Badge variant="secondary" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(note.createdAt)}
                        {note.updatedAt && (
                          <span className="ml-2 text-xs">(edited)</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-3 whitespace-pre-wrap">{note.content}</p>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editNoteContent">Note Content</Label>
                <Textarea
                  id="editNoteContent"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="editNoteTags">Tags (comma-separated)</Label>
                <input
                  id="editNoteTags"
                  type="text"
                  value={Array.isArray(editingNote.tags) ? editingNote.tags.join(', ') : editingNote.tags}
                  onChange={(e) => setEditingNote({...editingNote, tags: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="editIsPrivate"
                  type="checkbox"
                  checked={editingNote.isPrivate}
                  onChange={(e) => setEditingNote({...editingNote, isPrivate: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <Label htmlFor="editIsPrivate">Private note</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditNote} className="bg-orange-600 hover:bg-orange-700">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}