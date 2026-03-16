'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Loader2, ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

interface SchemaViewProps {
    schema: Record<string, {
        columns: Array<{ name: string; type: string; pk: boolean; notnull: boolean }>;
        relations: Array<{ toTable: string; fromColumn: string; toColumn: string }>;
    }>;
}

export const SchemaView = ({ schema }: SchemaViewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'neutral',
            securityLevel: 'strict',
        });
    }, []);

    useEffect(() => {
        if (!schema || !containerRef.current) return;

        const renderDiagram = async () => {
            setLoading(true);
            try {
                let definition = 'erDiagram\n';

                // Add tables and columns
                Object.entries(schema).forEach(([tableName, info]) => {
                    definition += `  ${tableName} {\n`;
                    info.columns.forEach(col => {
                        const type = col.type.replace(/\s/g, '_');
                        const pk = col.pk ? 'PK' : '';
                        definition += `    ${type} ${col.name} ${pk}\n`;
                    });
                    definition += '  }\n';
                });

                // Add relationships
                Object.entries(schema).forEach(([tableName, info]) => {
                    info.relations.forEach(rel => {
                        // erDiagram uses: TABLE1 ||--o{ TABLE2 : "relation"
                        // For simplicity, we'll use a generic one-to-many relationship
                        definition += `  ${rel.toTable} ||--o{ ${tableName} : "${rel.fromColumn}"\n`;
                    });
                });

                const { svg } = await mermaid.render('er-diagram-svg', definition);
                if (containerRef.current) {
                    // Use DOMParser to safely set SVG content
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(svg, 'image/svg+xml');
                    const svgNode = doc.documentElement;
                    containerRef.current.replaceChildren(svgNode);
                    // Make SVG responsive within the zoom container
                    const svgElement = containerRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.width = '100%';
                        svgElement.style.height = 'auto';
                        svgElement.style.maxWidth = 'none';
                    }
                }
            } catch (error) {
                console.error('Mermaid rendering failed:', error);
            } finally {
                setLoading(false);
            }
        };

        renderDiagram();
    }, [schema]);

    return (
        <div className="relative w-full h-[600px] bg-white/[0.03] border rounded-xl overflow-hidden shadow-inner">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/[0.04] backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
                </div>
            )}

            <TransformWrapper
                initialScale={1}
                initialPositionX={0}
                initialPositionY={0}
                centerOnInit
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                            <button
                                onClick={() => zoomIn()}
                                className="p-2 bg-white/[0.04] border rounded-lg shadow-sm hover:bg-white/[0.06] transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn className="h-5 w-5 text-white/60" />
                            </button>
                            <button
                                onClick={() => zoomOut()}
                                className="p-2 bg-white/[0.04] border rounded-lg shadow-sm hover:bg-white/[0.06] transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut className="h-5 w-5 text-white/60" />
                            </button>
                            <button
                                onClick={() => resetTransform()}
                                className="p-2 bg-white/[0.04] border rounded-lg shadow-sm hover:bg-white/[0.06] transition-colors"
                                title="Reset Zoom"
                            >
                                <RotateCcw className="h-5 w-5 text-white/60" />
                            </button>
                        </div>

                        <TransformComponent
                            wrapperStyle={{ width: '100%', height: '100%' }}
                            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <div ref={containerRef} className="p-12 min-w-[800px]" />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};
