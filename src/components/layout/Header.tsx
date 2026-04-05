import { useLayout } from '@/contexts/LayoutContext';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
    onAddWidget?: () => void;
}

export const Header = ({ onAddWidget }: HeaderProps) => {
    const { headerContent } = useLayout();

    return (
        <header className="h-16 lg:h-[72px] glass-header sticky top-0 z-30 px-4 lg:px-6 flex items-center transition-all duration-300 overflow-hidden">
            {/* Spacer for mobile hamburger */}
            <div className="w-10 lg:hidden" />

            {headerContent ? (
                <div className="w-full flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex-1 min-w-0">{headerContent}</div>
                    <NotificationCenter />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/30" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">System Active</span>
                    </div>
                    <NotificationCenter />
                </div>
            )}
        </header>
    );
};
