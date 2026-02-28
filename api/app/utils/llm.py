"""
LLM Integration for generating plain-English explanations of predictions.
"""

import os
from typing import Optional
import anthropic

MODEL_CONTEXT = {
    'brain_tumor': {'scan_type': 'brain MRI'},
    'pneumonia': {'scan_type': 'chest X-ray'},
    'retinal_oct': {'scan_type': 'retinal OCT scan'},
    'bone_fracture': {'scan_type': 'bone X-ray'},
}


def generate_explanation(
    model_name: str,
    prediction: str,
    confidence: float,
    probabilities: dict,
    original_image_b64: Optional[str] = None,
    overlay_image_b64: Optional[str] = None,
    comparison_image_b64: Optional[str] = None,
) -> Optional[str]:
    """
    Generate a plain-English explanation using Claude with vision.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not api_key:
        print("WARNING: ANTHROPIC_API_KEY not set")
        return None
    
    image_b64 = comparison_image_b64 or original_image_b64 or overlay_image_b64
    
    if not image_b64:
        print("WARNING: No images provided for explanation")
        return None
    
    model_ctx = MODEL_CONTEXT.get(model_name, {'scan_type': 'medical scan'})
    confidence_pct = round(confidence * 100, 1)
    
    if comparison_image_b64:
        image_desc = "a side-by-side view: original scan (left) and Grad-CAM overlay (right, red/yellow = AI focus areas)"
    else:
        image_desc = "a scan with Grad-CAM overlay showing AI focus areas"
    
    prompt = f"""This is {image_desc} of a {model_ctx['scan_type']}.
AI result: {prediction} ({confidence_pct}% confidence)

Write exactly 2 sentences:
1. The specific finding visible in this image that supports the {prediction} diagnosis (state the exact anatomical location confidently)
2. Where the Grad-CAM highlighting (red/yellow) is focused and what structure it corresponds to

STRICT RULES:
- NO markdown, headers, bullets, or special characters
- State anatomy confidently, do not hedge with "or" or "appears to be"
- Describe THIS image only, not general knowledge
- Ignore any text/labels on the image
- Plain text only"""

    try:
        client = anthropic.Anthropic(api_key=api_key)
        
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=120,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": image_b64
                        }
                    },
                    {"type": "text", "text": prompt}
                ]
            }]
        )
        
        return message.content[0].text.strip()
        
    except anthropic.APIError as e:
        print(f"ERROR: Anthropic API error: {e}")
        return None
    except Exception as e:
        print(f"ERROR: Exception generating explanation: {e}")
        return None


def get_fallback_explanation(
    model_name: str,
    prediction: str,
    confidence: float,
) -> str:
    """Fallback when LLM unavailable."""
    confidence_pct = round(confidence * 100, 1)
    return (
        f"The AI detected {prediction} with {confidence_pct}% confidence. "
        f"The highlighted regions show where the model focused."
    )