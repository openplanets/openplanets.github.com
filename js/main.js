	var githubApiRoot = "https://api.github.com/";
	var opfRoot = githubApiRoot + "orgs/openplanets"
	var opfRepoRoot = opfRoot + "/repos"
	var org;
	var repos;

	if (!Date.prototype.toISODate) {
	    Date.prototype.toISODate = function() {
	        function pad(n) { return n < 10 ? '0' + n : n }
	        return this.getUTCFullYear() + '-'
	            + pad(this.getUTCMonth() + 1) + '-'
	            + pad(this.getUTCDate());
	    };
	}
	
	function getOpfOrg() {
		$.ajax({
			url:		opfRoot,
			dataType:	"jsonp",
			success:	function(retData) {
							org = retData.data;
						}
			});
	}

	function getOpfRepos() {
		$.ajax({
			url:		opfRepoRoot,
			data:		{per_page: '100'},
			dataType:	"jsonp",
			success:	function(retData) {
							var html="<table><tr><th>Name</th><th>Description</th><th>Updated</th><th>Language</th><th>Open Issues</th></tr>";
							retData.data = retData.data.sort(function(x, y){
									if (x.updated_at > y.updated_at) {return -1};
									if (x.updated_at < y.updated_at) {return 1};
									return 0;
								});
							$.each(retData.data, function(i, item){
									html+='<tr><td>';
									html+=this.name;
									html+="</td><td>";
									html+=this.description;
									html+="</td><td>";
									var updated = new Date(this.updated_at);
									html+=updated.toISODate();
									html+="</td><td>";
									html+=this.language;
									html+="</td><td>";
									html+=this.open_issues;
									html+="</td></tr>";
								});
							html+="</table>";
							$('#content').empty();
				 			$('#content').html(html);
						}
			});
	}