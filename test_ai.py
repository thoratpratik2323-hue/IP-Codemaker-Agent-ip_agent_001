import requests

def test_nvidia():
    api_key = "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"
    base_url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    
    models_to_test = [
        "meta/llama-3.1-70b-instruct",
        "meta/llama3-70b-instruct",
        "nvidia/llama-3.1-nemotron-70b-instruct",
        "mistralai/mistral-7b-instruct-v0.2"
    ]
    
    for m in models_to_test:
        payload = {"model": m, "messages": [{"role": "user", "content": "Hello"}], "max_tokens": 50}
        try:
            r = requests.post(base_url, json=payload, headers=headers, timeout=5)
            print(f"NVIDIA Model '{m}': Status {r.status_code}")
            if r.status_code == 200:
                print("SUCCESS:", r.json()['choices'][0]['message']['content'])
                return m
        except Exception as e:
            print(f"Error testing {m}: {e}")
    return None

def test_pollinations():
    try:
        r = requests.post("https://text.pollinations.ai/", json={
            "messages": [{"role": "user", "content": "Write a 3-line python script to say Hello World"}]
        }, timeout=5)
        print("Pollinations Status:", r.status_code)
        if r.status_code == 200:
            print("Pollinations output:", r.text[:100])
            return True
    except Exception as e:
        print("Pollinations Error:", e)
    return False

if __name__ == "__main__":
    print("Testing NVIDIA Models...")
    test_nvidia()
    print("\nTesting Pollinations AI...")
    test_pollinations()
