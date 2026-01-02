import SoundBoard from '@/components/sounds/SoundBoard';
import { createClient } from '@/lib/supabase/server';

export default async function SoundscapesPage() {
    const supabase = await createClient();

    // 1. Fetch User and Pro Status
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user?.id)
        .single();

    const isPro = profile?.is_pro || false;

    return (
        <div className="p-6 lg:p-12 max-w-4xl mx-auto space-y-10">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Soundscapes</h1>
                <p className="text-zinc-500">Curated audio environments for deep focus.</p>
            </header>

            <div className="max-w-md">
                {/* Now passing the required isPro prop */}
                <SoundBoard isPro={isPro} />
            </div>
        </div>
    );
}