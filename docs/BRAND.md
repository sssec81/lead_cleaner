# LeadCleanr Brand System

LeadCleanr uses a compact four-color identity. Product UI should feel precise, private, and calm rather than loud or generically “tech.”

## Core palette

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Foundation | LeadCleanr Navy | `#102A43` | Primary text, dark sections, trust-led brand moments |
| Primary | LeadCleanr Cobalt | `#2454FF` | Main CTA, links, focus, active navigation |
| Transformation | Clean Mint | `#78E6C0` | Clean-output motif and small brand details only |
| Canvas | Warm Ivory | `#F6F4EE` | Page background and calm negative space |

## Supporting UI colors

- Surface: `#FFFFFF`
- Raised surface: `#FDFCFA`
- Muted surface: `#F4F5F7`
- Secondary text: `#596675`
- Hint text: `#707B88`
- Success: `#087A55`
- Warning: `#A86400`
- Danger: `#C81E32`

## Usage rules

1. Cobalt is the only primary-action color. Do not introduce another competing blue.
2. Mint represents cleaned output or transformation; it is not a replacement for accessible success green.
3. Navy carries typography and dark sections. Avoid pure black for branded surfaces.
4. Ivory is the default page canvas; white is reserved for cards and work areas.
5. Use semantic CSS tokens from `globals.css` instead of adding raw hex values in components.
6. Keep gradients limited to social artwork or very subtle atmospheric backgrounds.
