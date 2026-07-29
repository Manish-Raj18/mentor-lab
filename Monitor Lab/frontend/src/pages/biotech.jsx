import "../css_files/bio.css";
import ReviewSection from "../components/ReviewSection";
function BiotechSyllabus(){
  return (
   <>
   <div style={{margin: 0, padding: '30px 20px', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', backgroundColor: '#f8fafc'}}>

    <div style={{maxWidth: 1200, margin: '0 auto'}}>
        
        
        <div style={{textAlign: 'center', marginBottom: 30}}>
            <p style={{margin: '0 0 8px 0', fontSize: '0.85rem', color: '#0f766e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Career Guide Matrix</p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12}}>
                <h1 style={{margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em'}}>Biotechnology Roadmap</h1>
                <span style={{background: '#0f766e', color: '#ffffff', padding: '4px 14px', borderRadius: 30, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase'}}>6 Phases</span>
            </div>
            <p style={{margin: '0 auto', maxWidth: 780, fontSize: '1rem', color: '#475569', lineHeight: 1.5}}>An elite chronological guide built to navigate the journey from academic fundamentals to global enterprise biomanufacturing execution.</p>
        </div>
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 25, padding: '10px 0'}}>
            
            
            <div style={{position: 'absolute', width: 4, background: '#cbd5e1', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1}}></div>

        
            <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%', position: 'relative', zIndex: 2}}>
                <div style={{width: '45%', background: '#ffffff', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                    <div style={{padding: 14, background: '#0d9488', display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff'}}>
                        <span style={{fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>🔬</span>
                        <div>
                            <span style={{fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.05em'}}>Phase 01</span>
                            <h2 style={{margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff'}}>Foundational Sciences</h2>
                        </div>
                    </div>
                    <div style={{padding: 16}}>
                        <ul style={{margin: 0, paddingLeft: 16, color: '#334155', fontSize: '0.85rem', lineHeight: 1.6}}>
                            <li style={{marginBottom: 8}}><strong>Cell Biology & Genetics:</strong> Deciphering the fundamental operational rules of living cells, replication cycles, and chromosome structures.</li>
                            <li style={{marginBottom: 8}}><strong>General Chemistry:</strong> Mastering balancing stoichiometry, organic chemical reaction mechanisms, and solvent properties.</li>
                            <li><strong>Biostatistics:</strong> Deploying quantitative analysis models to evaluate chemical variants and biological hypothesis tests.</li>
                        </ul>
                    </div>
                </div>
                <div style={{position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', backgroundColor: '#0d9488', border: '3px solid #ffffff', width: 14, height: 14, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', position: 'relative', zIndex: 2}}>
                <div style={{width: '45%', background: '#ffffff', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                    <div style={{padding: 14, background: '#7c3aed', display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff'}}>
                        <span style={{fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>🧬</span>
                        <div>
                            <span style={{fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.05em'}}>Phase 02</span>
                            <h2 style={{margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff'}}>Core Biotechnology</h2>
                        </div>
                    </div>
                    <div style={{padding: 16}}>
                        <ul style={{margin: 0, paddingLeft: 16, color: '#334155', fontSize: '0.85rem', lineHeight: 1.6}}>
                            <li style={{marginBottom: 8}}><strong>Biochemistry:</strong> Exploring enzyme catalysis pipelines, molecular reactions, and complex metabolic pathways.</li>
                            <li style={{marginBottom: 8}}><strong>Microbiology:</strong> Investigating bacterial mutations, viral pathogens, culture maintenance, and fungal strains.</li>
                            <li><strong>Molecular Biology:</strong> Detailed validation of DNA extraction, transcriptions, and precise translation mechanics.</li>
                        </ul>
                    </div>
                </div>
                <div style={{position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', backgroundColor: '#7c3aed', border: '3px solid #ffffff', width: 14, height: 14, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%', position: 'relative', zIndex: 2}}>
                <div style={{width: '45%', background: '#ffffff', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                    <div style={{padding: 14, background: '#2563eb', display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff'}}>
                        <span style={{fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>⚙️</span>
                        <div>
                            <span style={{fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.05em'}}>Phase 03</span>
                            <h2 style={{margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff'}}>Advanced Technical Skills</h2>
                        </div>
                    </div>
                    <div style={{padding: 16}}>
                        <ul style={{margin: 0, paddingLeft: 16, color: '#334155', fontSize: '0.85rem', lineHeight: 1.6}}>
                            <li style={{marginBottom: 8}}><strong>Genetic Engineering:</strong> Mastering plasmid vector design, gene slicing vectors, and CRISPR sequence modification.</li>
                            <li style={{marginBottom: 8}}><strong>Immunology:</strong> Mapping adaptive immune systems and developing modern monoclonal antibodies.</li>
                            <li><strong>Bioprocess Engineering:</strong> Operating pilot-scale bioreactors, oxygen transfer rates, and filtration systems.</li>
                        </ul>
                    </div>
                </div>
                <div style={{position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', backgroundColor: '#2563eb', border: '3px solid #ffffff', width: 14, height: 14, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', position: 'relative', zIndex: 2}}>
                <div style={{width: '45%', background: '#ffffff', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                    <div style={{padding: 14, background: '#16a34a', display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff'}}>
                        <span style={{fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>💻</span>
                        <div>
                            <span style={{fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.05em'}}>Phase 04</span>
                            <h2 style={{margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff'}}>Bioinformatics & Data</h2>
                        </div>
                    </div>
                    <div style={{padding: 16}}>
                        <ul style={{margin: 0, paddingLeft: 16, color: '#334155', fontSize: '0.85rem', lineHeight: 1.6}}>
                            <li style={{marginBottom: 8}}><strong>Computational Biology:</strong> Writing custom sequence alignment script parsers using Python and R libraries.</li>
                            <li style={{marginBottom: 8}}><strong>Structural Biology:</strong> Processing 3D rendering profiles for protein folding arrays and active site binding.</li>
                            <li><strong>Systems Biology:</strong> Formulating intricate mathematical cell modeling structures to forecast mutation patterns.</li>
                        </ul>
                    </div>
                </div>
                <div style={{position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', backgroundColor: '#16a34a', border: '3px solid #ffffff', width: 14, height: 14, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%', position: 'relative', zIndex: 2}}>
                <div style={{width: '45%', background: '#ffffff', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                    <div style={{padding: 14, background: '#0284c7', display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff'}}>
                        <span style={{fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>🧫</span>
                        <div>
                            <span style={{fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.05em'}}>Phase 05</span>
                            <h2 style={{margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff'}}>Stem Cell Technology</h2>
                        </div>
                    </div>
                    <div style={{padding: 16}}>
                        <ul style={{margin: 0, paddingLeft: 16, color: '#334155', fontSize: '0.85rem', lineHeight: 1.6}}>
                            <li style={{marginBottom: 8}}><strong>Cellular Reprogramming:</strong> Managing induction factor metrics to translate somatic sequences into pluripotent iPSCs profiles.</li>
                            <li style={{marginBottom: 8}}><strong>Tissue Engineering:</strong> Formulating biodegradable structural scaffolds to seed engineered tissue systems.</li>
                            <li><strong>Regenerative Medicine:</strong> Culturing micro-organ systems for customized synthetic organ transplant research.</li>
                        </ul>
                    </div>
                </div>
                <div style={{position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', backgroundColor: '#0284c7', border: '3px solid #ffffff', width: 14, height: 14, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', position: 'relative', zIndex: 2}}>
                <div style={{width: '45%', background: '#ffffff', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                    <div style={{padding: 14, background: '#6d28d9', display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff'}}>
                        <span style={{fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>💊</span>
                        <div>
                            <span style={{fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.05em'}}>Phase 06</span>
                            <h2 style={{margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff'}}>Biopharmaceutical Dev</h2>
                        </div>
                    </div>
                    <div style={{padding: 16}}>
                        <ul style={{margin: 0, paddingLeft: 16, color: '#334155', fontSize: '0.85rem', lineHeight: 1.6}}>
                            <li style={{marginBottom: 8}}><strong>Drug Discovery:</strong> Operating screening automation loops to track active therapeutic small molecules.</li>
                            <li style={{marginBottom: 8}}><strong>Regulatory Affairs:</strong> Authoring phase protocols to achieve seamless FDA validation and international compliance.</li>
                            <li><strong>Biomanufacturing:</strong> Implementing global scale Good Manufacturing Practices (GMP) within cleanrooms.</li>
                        </ul>
                    </div>
                </div>
                <div style={{position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', backgroundColor: '#6d28d9', border: '3px solid #ffffff', width: 14, height: 14, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}}></div>
            </div>

        </div>
    </div>

</div>

   <ReviewSection targetType="biotech" />
   </>
  );
}

export default BiotechSyllabus;
