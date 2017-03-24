import json
from IBMQuantumExperience import IBMQuantumExperience


def main():
    config = {
        "url": 'https://quantumexperience.ng.bluemix.net/api'
    }
    token = "4a5156f58e814b56ebf122ff558e046442750ace846940d6d905c48ea02731d04b94ea93d1e745a74a69e66cfb983651e5084200ed00a4512163a0e26ab6c190"

    api = IBMQuantumExperience(token, config)

    with open('temp.qasm', 'r') as myfile:
        qasm = myfile.read()

    experiment = api.run_experiment(qasm, 'simulator', '1024', name='qcide', timeout=60)

    if 'error' in experiment:
        print json.dumps(experiment['error'])
        return

    image = api.get_image_code(experiment['idCode'])

    print json.dumps(image)


if __name__ == "__main__":
    main()
