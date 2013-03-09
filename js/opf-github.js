/**
 * Add function to output ISO style date without time
 */
if (!Date.prototype.toISODate) {
	Date.prototype.toISODate = function() {
		function pad(n) {
			return n < 10 ? '0' + n : n
		}
		return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-'
				+ pad(this.getUTCDate());
	};
}

/**
 * Array prototype function to reduce an array to its
 * unique values.
 */
Array.prototype.getUnique = function() {
	var u = {}, a = [];
	for ( var i = 0, l = this.length; i < l; ++i) {
		if (u.hasOwnProperty(this[i])) {
			continue;
		}
		a.push(this[i]);
		u[this[i]] = 1;
	}
	return a;
}

/**
 * Get the GitHub API URLs somewhere sensible
 */
var gitHubURLs = {
	root : function() {
		return "https://api.github.com";
	},
	opfOrg : function() {
		return this.root() + "/orgs/openplanets";
	},
	opfRepos : function() {
		return this.opfOrg() + "/repos";
	},
	repoContents : function(repoURL) {
		return repoURL + "/contents";
	}
}

/**
 * Startup function to populate the table with the OPF repos
 */
function displayOpfRepoTable() {
	// Call for list of OPF repos
	$.ajax({
		url : gitHubURLs.opfRepos(),
		// Avoid pagination hack, request the max
		// 100 repos, we had 50 at the time of writing
		data : {
			per_page : '100'
		},
		dataType : "jsonp",
		// Callback for success, processes the 
		// returned data, an array of repo objects
		success : function(retData, message, jhXHR) {
			// Sort the list by when last updated
			retData.data.sort(function(a, b) {
				if (a.updated_at > b.updated_at)
					return -1;
				if (a.updated_at < b.updated_at)
					return 1;
				return 0;
			});
			// Process the sorted array
			repoArrayToTable(retData.data);
			checkBasicPolicy(retData.data);
		}
	});
}

/**
 * Takes the list of repos and creates the table rows and cells
 * needed to populate the table on the page.
 * 
 * @param repos - the array of GitHub repo objects
 */
function repoArrayToTable(repos) {
	// Lanuage array, and issue var for counters
	var langs = ["Unknown"], issueCount = 0;
	// Process each repo in the array
	$.each(repos, function(i, item) {
		// Create a table row, with same id as the repo
		var row = $('<tr>').attr({id : this.id.toString()});
		var nameCell = $('<td>');
		// Anchor that links to GitHub page, with repo name
		// html value and description as title
		var nameAnchor = $('<a>');
		nameAnchor.attr({
			href: 	this.html_url,
			title:	this.description
		});
		nameAnchor.html(this.name);
		nameAnchor.appendTo(nameCell);
		row.append(nameCell);
		// Blanks for README and LICENSE
		row.append('<td>No</td>');
		row.append('<td>No</td>');
		// Cell for updated date
		var updated = new Date(this.updated_at);
		row.append('<td>' + updated.toISODate() + '</td>');
		// Language, switch to unknown and add to array
		if (this.language == null) this.language = 'Unknown'; 
		langs.push(this.language);
		row.append('<td>' + this.language + '</td>');
		// Add issue count to total and then the cell
		issueCount+=this.open_issues;
		row.append('<td>' + this.open_issues + '</td>');
		// Append to table nody
		$('#repo-table > tbody').append(row);
	});
	// Fill in the counter cells
	$('#repoCount').html(repos.length);
	$('#langCount').html(langs.getUnique().length - 1);
	var lastUpdate = new Date(repos[0].updated_at);
	$('#lastUpdate').html(lastUpdate.toISODate());
	$('#issueCount').html('' + issueCount);
}

/**
 * Function to check contents of repo root for software
 * documentation required for all OPF projects:
 *   - README.md
 *       The GitHub README file.
 *   - LICENSE
 *       Statement of software license.
 *   - .opf.yml
 *       Basic project metadata.
 *       
 * @param repos - the list of repositories to check
 * 
 */
function checkBasicPolicy(repos) {
	// TODO: this processes the first item from the list
	// for now to preserve precious GitHub API calls.
	
	// Call to get repo contents for root dir
	$.ajax({
		url :		gitHubURLs.repoContents(repos[0].url),
		type :		"get",
		dataType :	"jsonp",
		success :	function(retData, message, jqXHR) {
			// Success function currently empties the readme cell
			$('#' + repos[0].id + ' > td:eq(1)').empty();
		}
	});
}
