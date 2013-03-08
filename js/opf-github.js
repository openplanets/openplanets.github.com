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
	}
}

function displayOpfRepoTable() {
	$.ajax({
		url : gitHubURLs.opfRepos(),
		data : {
			per_page : '100'
		},
		dataType : "jsonp",
		success : function(retData, message, jhXHR) {
			retData.data.sort(function(a, b) {
				if (a.updated_at > b.updated_at)
					return -1;
				if (a.updated_at < b.updated_at)
					return 1;
				return 0;
			});
			procRepoArray(retData.data);
		}
	});
}

function procRepoArray(repos) {
	var langs = [];
	var issues = 0;
	$.each(repos, function(i, item) {
		var row = $('<tr>');
		row.id = this.id;
		var nameCell = $('<td>');
		var nameAnchor = $('<a>');
		nameAnchor.attr({
			href: 	this.html_url,
			title:	this.description
		});
		nameAnchor.html(this.name);
		nameAnchor.appendTo(nameCell);
		row.append(nameCell);
		row.append('<td>No</td>');
		row.append('<td>No</td>');
		var updated = new Date(this.updated_at);
		row.append('<td>' + updated.toISODate() + '</td>');
		row.append('<td>' + this.language + '</td>');
		issues+=this.open_issues;
		row.append('<td>' + this.open_issues + '</td>');
		$('#repo-table > tbody').append(row);
		langs.push(this.language);
	});
	$('#repoCount').html(repos.length);
	$('#langCount').html(langs.getUnique().length);
	var lastUpdate = new Date(repos[0].updated_at);
	$('#lastUpdate').html(lastUpdate.toISODate());
	$('#issueCount').html('' + issues);
}

function hasReadme(repoId, repoURL) {
	var readmeURL = repoURL + "/blob/master/README.md";
	$.ajax({
		url : readmeURL,
		type : "HEAD",
		complete : function(jqXHR, textStatus) {
			alert(repoId + ":" + jqXHR.status);
		}
	});
}

function hasLICENSE(repoURL) {

}