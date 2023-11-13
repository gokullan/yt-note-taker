const { mdToPdf } = require("md-to-pdf");

function getJaxSupport() {
	var jax = "<script> MathJax =";
	jax += JSON.stringify({
		tex: {
			inlineMath: [['$', '$'], ['\\(', '\\)']],
		},
	});
	jax += ";</script><script src='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'></script>"
	return jax;
}

exports.createFile = async (videoId) => {
	const res = await fetch("http://localhost:5000/notes/video/fetch", {
		method: "POST",
		body: JSON.stringify({
			videoId: videoId,
		}),
		headers: {
			"Content-Type": "application/json"
		}
	});
	// sort notes in ascending order
	const notes = (await res.json()).sort((a, b) => {
		return a["timestamp_"].localeCompare(b["timestamp_"]);
	});

	var allContents = getJaxSupport() + "\n\n";
	notes.map((note) => {
		note["note_"].split("\n").map((part) => {
			// add text
			allContents += part + "\n";
		});
		// add image
		if (note["img_url"]) {
			allContents += `![Alt text](${note["img_url"]})\n`;
		}
		allContents += "\n\n";
	})
	
	await mdToPdf({
		content: allContents, 
	}, {
		dest: "./hello_world.pdf",
	});
}
